_mock.ftp = (function(){
  'use strict';

    var ftpClient, host,root,user,password,port, projectname, cid, cwd;

    function _send(data, files){
        var deferred = Q.defer();
        host = data.host;
        root = data.folder || '.';
        user = data.user;
        password = data.pass;
        port = data.port || 21;
        projectname = data.projectname;

        if(data.packaged && data.versioned){
            // Upload versioned zip
            // TODO
        }else

        if(!data.packaged && !data.versioned){
            // Upload all files (overwrite)
            // TODO 
        }else

        if(!data.packaged && data.versioned){
            // Upload versioned files
            // TODO
        }else{
            // Upload zip (overwrite)
            // TODO

        }

        _upload(files).then(deferred.resolve);

        cwd = host+'/'+root;

        return deferred.promise;
    }

    function _upload(files){
        var deferred = Q.defer();
        ftpClient = new FtpClient(host, port, user, password);

        // Connect
        ftpClient.connect()
            // List directory contents
            .then(ftpClient.list.bind(ftpClient))
            
            // Verify the root folder exists and verify the mockbox folder exists
            .then(verifyBaseFolders)

            // Verify the project folder exists 
            .then(verifyProjFolder)

            // Create a Version Folder 
            .then(newVersionFolder)

            // Verify the required sub folders exists  i.e (script/, styles/)
            .then(function(){
                var deferred = Q.defer();
                createSubFolders(files).then(deferred.resolve);
                return deferred.promise;
            })
            .then(function(){
                var deferred = Q.defer();

                var i = 0;
                _mock.utils.promiseLoop(function(){ return i < files.length; },
                  function () {
                    var filename = files[i].folder ? files[i].folder+'/'+files[i].name : files[i].name;
                    if(files[i].data){
                        ftpClient.upload(filename, files[i].data);
                    }
                    i++;
                    return Q.delay(500); // arbitrary async
                  }).then(deferred.resolve);

                return deferred.promise;
                
            })

            // Disconnect
            .then(ftpClient.disconnect.bind(ftpClient))
            .then(deferred.resolve);

            return deferred.promise;
    }

    function verifyBaseFolders(dirs){
        var deferred = Q.defer();
        var hasFolder = false;

        // Look to see if folder exists
        dirs.forEach(function(dir) {
            if (dir.name === root) {
                hasFolder = true;
                return false;
            }
        });

        // Create a folder if one doesn't exist
        if (!hasFolder) {
            // Create Root Folder
            ftpClient._mkd('./'+root)
            // Point to newly created Root Folder
            .then(function(){
                var deferred = Q.defer();
                ftpClient._cwd('./'+root).then(deferred.resolve)
                return deferred.promise;
            })

            // Create mockbox folder
            .then(verifyMockboxFolder)

            // Exit
            .then(deferred.resolve);
        
        } else {
            // Point to Root Folder
            ftpClient._cwd('./'+root)

            // Create mockbox folder if needed
            .then(verifyMockboxFolder)

            // Exit
            .then(deferred.resolve);
        }

        return deferred.promise;
    }

    function verifyMockboxFolder(){
        var deferred = Q.defer();        
        
        ftpClient.list()
        .then(function(dirs){
            var deferred = Q.defer();
            var hasFolder = false;

            // Look to see if folder exists
            dirs.forEach(function(dir) {
                if (dir.name === 'mockbox') {
                    hasFolder = true;
                    return false;
                }
            });

            // Create a folder if one doesn't exist
            if (!hasFolder) {
                // Create folder
                ftpClient._mkd('mockbox')
            
                // Point to newly created folder
                .then(function(){
                    var deferred = Q.defer();
                    ftpClient._cwd('mockbox').then(deferred.resolve)
                    return deferred.promise;
                })

                // Exit
                .then(deferred.resolve);
            
            } else {
                // Point to folder & exit
                ftpClient._cwd('mockbox').then(deferred.resolve);
            }

            cwd += '/mockbox';

            return deferred.promise;
        }).then(deferred.resolve);

        return deferred.promise;
    }

    function verifyProjFolder(){
        var deferred = Q.defer();        

        ftpClient.list()
        .then(function(dirs){
            var deferred = Q.defer();
            var hasFolder = false;

            // Look to see if folder exists
            dirs.forEach(function(dir) {
                if (dir.name === projectname) {
                    hasFolder = true;
                    return false;
                }
            });

            // Create a folder if one doesn't exist
            if (!hasFolder) {
                // Create Folder
                ftpClient._mkd(projectname)
            
                // Point to folder
                .then(function(){
                    var deferred = Q.defer();
                    ftpClient._cwd(projectname).then(deferred.resolve)
                    return deferred.promise;
                })

                // Exit
                .then(deferred.resolve);
            } else {

                // Point to folder & exit
                ftpClient._cwd(projectname).then(deferred.resolve);
            }

            cwd += '/' + projectname;

            return deferred.promise;

        }).then(deferred.resolve);

        return deferred.promise;
    }

    function newVersionFolder(){
        var deferred = Q.defer();        
        var versionId = _mock.utils.getGUID();

        cwd += '/' + versionId;
        // Create a folder if one doesn't exist
        ftpClient._mkd(versionId)

        // Point to folder
        .then(function(){
            var deferred = Q.defer();
            cid = versionId;
            ftpClient._cwd(versionId).then(deferred.resolve)
            return deferred.promise;
        })

        // Exit
        .then(deferred.resolve);

        return deferred.promise;
    }

    function createSubFolders(files){
        var deferred = Q.defer(); 
        loopFolders(files).then(deferred.resolve);
        return deferred.promise;
    }


    function loopFolders(files){
        var deferred = Q.defer();

        var i = 0;
        _mock.utils.promiseLoop(function(){ return i < files.length; },
          function () {
            if(files[i].folder){
                ftpClient._mkd(files[i].folder);
            }
            
            i++;
            
            return Q.delay(500); // arbitrary async

          }).then(deferred.resolve);

        return deferred.promise;
        
    }

  return {
    send: function(data, files){
         var deferred = Q.defer();
        _send(data, files)
        .then(function(){
            var deferred = Q.defer();
            //_mock.notification.setLink({url:cwd, text:'[ID: '+cid+']', title:cwd});
            _mock.notification.send({type:'success', message:'Export Complete'});

            deferred.resolve();
            return deferred.promise;
        })
        .then(deferred.resolve);
        return deferred.promise;
    }
  };

}());