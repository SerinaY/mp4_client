var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }

    }
});

mp4Services.factory('Llamas', function($http, $window) {
    return {
        getUsers : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users');
        },
        getTasks : function(skip,completed,query) {
            var baseUrl = $window.sessionStorage.baseurl;
            //console.log(baseUrl+'/api/tasks?where='+JSON.stringify(completed) +'&limit=10&skip=' + skip+'&sort='+JSON.stringify(query));
            return $http.get(baseUrl+'/api/tasks?where='+JSON.stringify(completed) +'&limit=10&skip=' + skip+'&sort='+JSON.stringify(query));
        },
        getOne : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(baseUrl+'/api/users/'+id);
            return $http.get(baseUrl+'/api/users/'+id);
        },
        addOne : function(obj) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/users/',obj);
        },
        putOne : function(id,obj) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl+'/api/users/'+id, obj);
        },
        addT : function(obj) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/tasks/',obj);
        },
        putT : function(obj) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl+'/api/tasks/'+obj._id, obj);
        },
        getTL : function(userid, completed) {
            var baseUrl = $window.sessionStorage.baseurl;
            if(completed)
                return $http.get(baseUrl+'/api/tasks/?where={"assignedUser": "'+userid+'", "completed": "true"}');
            return $http.get(baseUrl+'/api/tasks/?where={"assignedUser": "'+userid+'", "completed": "false"}');
        },
        getT : function(taskid) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(baseUrl+'/api/tasks/'+taskid);
            return $http.get(baseUrl+'/api/tasks/'+taskid);
        },
        deleteOne: function(id){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/users/'+id);
        },
        deleteT: function(id){
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/tasks/'+id);
        }
    }
});
