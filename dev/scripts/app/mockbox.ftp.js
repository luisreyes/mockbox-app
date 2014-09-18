_mock.ftp = (function(){
  'use strict';

    var ftpClient,
        host,
        root,
        user,
        password,
        port,
        projectname,
        cid,
        cwd,
        files,
        versioned,
        packaged;

    function _send(data){
        var deferred = Q.defer();
        host = data.host;
        root = data.folder || '.';
        user = data.user;
        password = data.pass;
        port = data.port || 21;
        projectname = data.projectname;

        if(data.packaged && data.versioned){
            // Upload versioned zip
            _upload('vz').then(deferred.resolve);
        }else{
            _upload().then(deferred.resolve);
        }

        cwd = host+'/'+root;

        return deferred.promise;
    }

    function _upload(type){
        var deferred = Q.defer();
        ftpClient = new FtpClient(host, port, user, password);

        switch(type){
            case 'vz':
                // Connect
                ftpClient.connect()
                    // List Directory Contents
                    .then(ftpClient.list.bind(ftpClient))
                    // Create Root/MockBox Folder i.e: ./public_html/MockBox
                    .then(_createBaseFolders)
                    // Create Project Folder i.e: ./public_html/MockBox/MyProjectFolder 
                    .then(_createProjectFolder)
                    // Upload Files to Folders
                    .then(_uploadFiles)
                    // Disconnect
                    .then(ftpClient.disconnect.bind(ftpClient))
                    // Resolve ftpClient.connect()
                    .then(deferred.resolve);
            break;
            default:
                // Connect
                ftpClient.connect()
                    // List Directory Contents
                    .then(ftpClient.list.bind(ftpClient))
                    // Create Root/MockBox Folder i.e: ./public_html/MockBox
                    .then(_createBaseFolders)
                    // Remove project folder to recreate complete structure
                    //.then(_cleanupProjectFolder)
                    // Create Project Folder i.e: ./public_html/MockBox/MyProjectFolder 
                    .then(_createProjectFolder)
                    // Create a Version Folder i.e: ./public_html/MockBox/MyProjectFolder/v 
                    .then(_createRootVersionFolder)
                    // Create Sub-folders i.e: ./public_html/MockBox/MyProjectFolder/scripts
                    .then(_createProjectSubFolders)
                    // Upload Files to Folders
                    .then(_uploadFiles)
                    // Disconnect
                    .then(ftpClient.disconnect.bind(ftpClient))
                    // Resolve ftpClient.connect()
                    .then(deferred.resolve);
            break;
        }
        
        // Return promise from ftpClient.connect()
        return deferred.promise;
    }

    function _createBaseFolders(dirs){
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
                ftpClient._cwd('./'+root).then(deferred.resolve);
                return deferred.promise;
            })

            // Create mockbox folder
            .then(_createMockboxFolder)

            // Exit
            .then(deferred.resolve);
        
        } else {
            // Point to Root Folder
            ftpClient._cwd('./'+root)

            // Create mockbox folder if needed
            .then(_createMockboxFolder)

            // Exit
            .then(deferred.resolve);
        }

        return deferred.promise;
    }

    function _createMockboxFolder(){
        var deferred = Q.defer();        
        
        ftpClient.list()
        .then(function(dirs){
            var deferred = Q.defer();
            var hasFolder = false;

            // Look to see if folder exists
            dirs.forEach(function(dir) {
                if (dir.name === 'MockBox') {
                    hasFolder = true;
                    return false;
                }
            });

            // Create a folder if one doesn't exist
            if (!hasFolder) {
                // Create folder
                ftpClient._mkd('MockBox')
            
                // Point to newly created folder
                .then(function(){
                    var deferred = Q.defer();
                    ftpClient._cwd('MockBox').then(deferred.resolve);
                    return deferred.promise;
                })

                // Exit
                .then(deferred.resolve);
            
            } else {
                // Point to folder & exit
                ftpClient._cwd('MockBox').then(deferred.resolve);
            }

            cwd += '/MockBox';

            return deferred.promise;
        }).then(deferred.resolve);

        return deferred.promise;
    }

    function _cleanupProjectFolder(){
        var deferred = Q.defer();

        // If not Zipped and not versioned
        if(!_isPackaged() && !_isVersioned()){
            // Get contents of current directory
            ftpClient.list()
            .then(function(dirs){
                var deferred = Q.defer();
                var hasProjectFolder =  false;
                // Loop through contents of the cwd
                dirs.forEach(function(dir) {
                    // Look to see if project folder exists
                    if (dir.name === projectname) {
                        // Found the project folder                        
                        hasProjectFolder = true;
                        // Exit Loop
                        return false;
                    }
                });

                if(hasProjectFolder){
                    // Set project folder as cwd
                    ftpClient._cwd(projectname)
                    .then(function(){
                        var deferred = Q.defer();
                        
                        // Get contents of project folder
                        ftpClient.list()
                        // Loop project folder's content
                        .then(function(list){
                            var deferred = Q.defer();
                            
                            list.forEach(function(item){
                                // Find files
                                if(item.type === 'file'){
                                    // Delete files
                                    ftpClient._dele(item.name);
                                }else
                                // Find folders that are not 'v' (versions folder)
                                if((item.type === 'dir') && (item.name != 'v')){
                                    console.log('RMD FOLDER: ' + item.name);
                                    ftpClient._cwd(item.name)
                                    .then(_removeFiles)
                                    .then(ftpClient._rmd(item.name));
                                }
                            });
                            
                            deferred.resolve();

                            return deferred.promise;
                        
                        }).then(deferred.resolve);
                        
                        return deferred.promise;
                    }).then(deferred.resolve);
                    
                
                }else{
                    deferred.resolve();
                }
                
                return deferred.promise;
            
            }).then(deferred.resolve);
        }else{
            deferred.resolve();
        }
        
        return deferred.promise;
    }

    function _removeFiles(){
        var deferred = Q.defer();
        
        ftpClient.list()
        .then(function(list){
            var deferred = Q.defer();
            list.forEach(function(item){
                // Find files
                if(item.type === 'file'){
                    // Delete files
                    ftpClient._dele(item.name);
                }

            });

            deferred.resolve();
            return deferred.promise;

        }).then(deferred.resolve);
        
        return deferred.promise;
    }

    function _createProjectFolder(){
        var deferred = Q.defer();        
        if(!_isPackaged()){
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
                        ftpClient._cwd(projectname).then(deferred.resolve);
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
        }else{
            deferred.resolve();
        }

        return deferred.promise;
    }

    function _createRootVersionFolder(){
        var deferred = Q.defer();   
        if(_isVersioned()){
            // Get cwd contents
            ftpClient.list()
            .then(function(dirs){
                var deferred = Q.defer();
                var hasFolder = false;

                // Look to see if folder exists
                dirs.forEach(function(dir) {
                    if (dir.name === 'v') {
                        hasFolder = true;
                        return false;
                    }
                });

                if(hasFolder){
                    ftpClient._cwd('v')
                    .then(_createVersionFolder)
                    .then(deferred.resolve);
                }else{
                    // Create root versions folder if one doesn't exist
                    ftpClient._mkd('v')
                    // Create a folder if one doesn't exist
                    .then(function(){
                        var deferred = Q.defer();
                        ftpClient._cwd('v').then(deferred.resolve);
                        return deferred.promise;
                    })
                    .then(_createVersionFolder)
                    .then(deferred.resolve);
                }

                return deferred.promise;
            })

            // Exit
            .then(deferred.resolve);
        }else{
            deferred.resolve();
        }

        return deferred.promise;
    }

    function _createVersionFolder(){
        var deferred = Q.defer();
        var versionId = _mock.utils.getGUID();

        ftpClient._mkd(versionId)
        .then(function(){
            var deferred = Q.defer();
            ftpClient._cwd(versionId).then(deferred.resolve);
            return deferred.promise;
        }).then(deferred.resolve);

        return deferred.promise;
    }

    function _createProjectSubFolders(){
        var deferred = Q.defer();
        if(!_isPackaged()){
            // Get and cache files locally
            var files = _getFiles();
            // Initialize Index for Looping
            var i = 0;
            // Loop Through Promises
            _mock.utils.promiseLoop(
                function(){ return i < files.length; },
                function () {
                    if(files[i].folder){
                        ftpClient._mkd(files[i].folder);
                    }
                    i++;
                    return Q.delay(500); // arbitrary async
                }).then(deferred.resolve);
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    }

    function _uploadFiles(){
        var deferred = Q.defer();
        // Get and cache files locally
        var files = _getFiles();
        // Initialize Index for Looping
        var i = 0;
        // Loop Through Promises
        _mock.utils.promiseLoop(
            function(){ return i < files.length; },
            function () {
                var filename = files[i].folder ? files[i].folder+'/'+files[i].name : files[i].name;
                if(files[i].data){
                    ftpClient.upload(filename, files[i].data);
                }
                i++;
                return Q.delay(500); // arbitrary async
              }).then(deferred.resolve);

        return deferred.promise;
    }

    function _getFiles(){ return files; }
    function _setFiles(val){ files = val; }

    function _isVersioned(){ return versioned; }
    function _setIsVersioned(val){ versioned = val; }

    function _isPackaged(){ return packaged; }
    function _setIsPackaged(val){ packaged = val; }

  return {
    send: function(data, files){
        
        _setFiles(files);
        _setIsVersioned(data.versioned);
        _setIsPackaged(data.packaged);

        var deferred = Q.defer();
        _send(data)
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