_mock.ftp = (function(){
  'use strict';

    var ftpClient, host,root,user,password,port;

    function _send(data, files){
        var deferred = Q.defer();
        host = data.host;
        root = 'mockbox';
        user = data.user;
        password = data.pass;
        port = data.port || 21;

        _upload(files).then(deferred.resolve);

        return deferred.promise;
    }

    function _upload(files){
        var deferred = Q.defer();
        ftpClient = new FtpClient(host, port, user, password);

        // Connect
        ftpClient.connect()
            // List directory contents
            .then(ftpClient.list.bind(ftpClient))
            .then(
                // Check/Create Root Directory
                function(dirs) {
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
                    ftpClient._mkd("./"+root).then(deferred.resolve);
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            })

            .then(function(){
                var deferred = Q.defer();

                var i = 0;
                _mock.utils.promiseLoop(function(){ return i < files.length; },
                  function () {
                    ftpClient.upload(files[i].name, files[i].data);
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

  return {
    send: function(data, files){
         var deferred = Q.defer();
        _send(data, files).then(deferred.resolve);
        return deferred.promise;
    }
  };

}());