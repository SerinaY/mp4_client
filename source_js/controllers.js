var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('ProfileController', ['$scope', '$routeParams' ,'Llamas','CommonData' , function($scope, $routeParams,Llamas, CommonData) {
  $scope.user = "";
  $scope.hasUser = false;
  $scope.utasks ;
  $scope.ctasks ;
  $scope.id = $routeParams.UserId;
  getTasks();

  $scope.complete = function (id) {
    Llamas.getT(id).success(function (data) {
      //$scope.$apply();
      var curr_task = data.data;
      curr_task.completed = true;
      Llamas.putT(curr_task).success(function (data) {
        getTasks();
      }).error(function (data) {
        $scope.message = data.message;
      });

    }).error(function (data) {
      console.log("error while updating");
    });
  };
  $scope.show = function(){
      var completed = document.getElementById("completed");
    //console.log(completed.style.display );
    if(window.getComputedStyle(completed).getPropertyValue('display')=="block")
      $('#completed').css("display", "none");
    else{
      $('#completed').css("display", "block");
    }
  }
  function getTasks(){
    Llamas.getOne($scope.id).success(function (data) {
      $scope.hasUser = true;
      $scope.user = data.data;
      Llamas.getTL($scope.user._id,false).success(function(data){
        $scope.utasks = data.data;
      }).error(function (data) {
        console.log("cannot get task" + $scope.user.pendingTasks[i]);
      });
      Llamas.getTL($scope.user._id,true).success(function(data){
        $scope.ctasks = data.data;
      }).error(function (data) {
        console.log("cannot get task" + $scope.user.pendingTasks[i]);
      });


    }).error(function (data) {
      $scope.hasUser = false;
      $scope.user = data.message;
    });
  }



}]);
mp4Controllers.controller('TaskController', ['$scope', '$routeParams' ,'Llamas','CommonData','$filter' , function($scope, $routeParams,Llamas, CommonData,$filter) {
  $scope.id = $routeParams._id;
  $scope.task;
  $scope.date;
  $scope.create;
  $scope.completed;
  $scope.user;
  $scope.hasTask = false;
  update();
  function update() {
    Llamas.getT($scope.id).success(function (data) {
      $scope.hasTask = true;
      $scope.task = data.data;
      $scope.date = $filter('date')($scope.task.deadline, "longDate");
      $scope.create = $filter('date')($scope.task.dateCreated, "longDate");
      Llamas.getOne($scope.task.assignedUser).success(function (data) {
        $scope.user=data.data;
      }).error(function(data){
        console.log("error getting the assignee");
      });
      console.log($scope.task );
      if($scope.task.completed)
        $scope.completed='Done';
      else
        $scope.completed='Pending';
    }).error(function (data) {
      $scope.message = data.message;
    });
  }
  $scope.complete = function (id) {
    Llamas.getT(id).success(function (data) {
      var curr_task = data.data;
      if(!curr_task.completed )
        curr_task.completed = true;
      else
        curr_task.completed = false;
      Llamas.putT(curr_task).success(function (data) {
        update();
      }).error(function (data) {
        $scope.message = data.message;
      });

    }).error(function (data) {
      console.log("error while updating");
    });
  };

}]);



mp4Controllers.controller('TasksController', ['$scope', 'Llamas', 'CommonData' , function($scope, Llamas,CommonData) {
  $scope.skip = 0;
  $scope.tasks;
  $scope.param={};
  $scope.hasmore = true;
  $scope.sortby = 'name';
  $scope.orderby = '1';
  $scope.param[$scope.sortby.toString()] = $scope.orderby;
  $scope.complete={};
  getTen();
  function getTen(){
    Llamas.getTasks($scope.skip,$scope.complete,$scope.param).success(function (data) {
      $scope.tasks = data.data;
    }).error(function (data) {
      $scope.tasks = data.message;
    });
  }

  $scope.addskip = function(){
    if(!$scope.hasmore)
      return;
    if($scope.skip==0)
      $('#prev-arrow').removeClass("disabled");
    $scope.skip += 10;
    getTen($scope.skip);


    Llamas.getTasks($scope.skip+10,$scope.complete,$scope.param).success(function (data) {
      var prefetch = data.data;
      if(prefetch < 10){
        $('#next-arrow').addClass("disabled");
        $scope.hasmore=false;
      }
    }).error(function (data) {
      $scope.tasks = data.message;
    });

  }
  $scope.minusskip = function(){
    if($scope.skip==0)
      return;
    $scope.skip -= 10;
    getTen();
    $('#next-arrow').removeClass("disabled");
    $scope.hasmore = true;
    if($scope.skip == 0){
      $('#prev-arrow').addClass("disabled");
    }


  }
  $scope.del = function(task){
    console.log(task);
    Llamas.deleteT(task._id).success(function (data) {
      getTen();
    }).error(function (data) {
      $scope.tasks = data.message;
    });
    if(task.assignedUser!=""&&task.assignedUser!=undefined&&task.assignedUser!=null) {
      Llamas.getOne(task.assignedUser).success(function (data) {
        var user = data.data;
        console.log(user);
        var idx = user.pendingTasks.indexOf(task._id);
        if (idx > -1) {
          user.pendingTasks.splice(idx, 1);
          Llamas.putOne(user._id, user).success(function (data) {
            console.log(data);
          }).error(function () {
            console.log("err while updating from user");
          });
        }
      }).error(function (data) {
        console.log("error getting the assignee");
      });
    }

  }
  $('#filter').on( 'click', 'button', function() {
    var value = $( this ).attr('data-filter');
    if(value == "Completed"){
      $scope.complete.completed=true;
    }
    else if(value == "Pending"){
      $scope.complete.completed=false;
    }
    else{
      $scope.complete={};
    }
    getTen();
  });
  $scope.update = function(){
    $scope.param = {};
    $scope.param[$scope.sortby.toString()] = $scope.orderby;
    getTen();

  }


}]);


mp4Controllers.controller('UserListController', ['$scope', 'Llamas',  'CommonData' ,function($scope,  Llamas, CommonData) {

  $scope.users;
  var update = function () {
    Llamas.getUsers().success(function (data) {
      $scope.users = data.data;
    }).error(function (data) {
      $scope.users = data.message;
    }).then(function () {
      CommonData.setData($scope.users);
    });
  }
  update();
  $scope.del = function (user) {
    Llamas.deleteOne(user._id).success(function (data) {
      //$scope.$apply();
      update();
      var temp = user.pendingTasks;

      for(var i = 0; i < temp.length; i++){
        Llamas.getT(temp[i]).success(function (data) {
          var task = data.data;
          task.assignedUser = "";
          task.assignedUserName = "unassigned";
          Llamas.putT(task).success(function (data) {
            console.log(data);
          }).error(function (data) {
            $scope.message = data.message;
          });
        }).error(function (data) {
          $scope.message = data.message;
        });
      }
    }).error(function (data) {
      console.log("error while deleting");
    });
  };



}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = "http://www.uiucwp.com:4000";

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);
mp4Controllers.controller('AddUserController', ['$scope' ,'Llamas' , function($scope, Llamas) {

  $scope.name = "";
  $scope.email = "";
  $scope.message = "";
  $scope.post = function() {
    var email = document.getElementById("em");
    var submit = document.getElementById("subm");
    if (email.validity.typeMismatch) {
      email.setCustomValidity("please enter a valid email!");
      return;
    }
    if($scope.name == "" || $scope.email == ""){
      return;
    }

    var obj = {};
      obj['name'] = $scope.name;
      obj['email'] = $scope.email;
    console.log(obj);
      Llamas.addOne(obj).success(function (data) {
        console.log(data.data);
        $scope.message = "User "+$scope.name+" added";
      }).error(function (data) {
        $scope.message = data.message;
      }).then(function() {
        setTimeout(function () {
          $scope.message = "";
        }, 1000);
      });



  };
  $(document).foundation();


}]);
mp4Controllers.controller('AddTController', ['$scope' , '$window', 'Llamas','CommonData', function($scope, $window,Llamas, CommonData) {
  //$scope.user = "Select a user";
  $scope.date;
  $scope.name;
  $scope.message = "";
  $scope.users;
  $scope.myuser;
  $scope.taskobj;
  $scope.userobj;

  $(document).foundation();
  Llamas.getUsers().success(function (data) {
    $scope.users = data.data;
  }).error(function (data) {
    $scope.users = data.message;
    $scope.myuser = $scope.users[0];
  });

  $scope.add = function() {

    if($scope.name == undefined ||$scope.date == undefined){
      return;
    }
    console.log($scope.name,$scope.date,$scope.myuser);
    var obj = {};
    obj.name = $scope.name;
    obj.description = $scope.des;
    obj.deadline = $scope.date;
    obj.completed = false;
    obj.assignedUser = $scope.myuser._id;
    obj.assignedUserName = $scope.myuser.name;
    var d = new Date();
    obj.dateCreated = (d.getMonth()+1).toString()+d.getDate().toString()+d.getFullYear().toString();
    obj.deadline = $scope.date;
    console.log(obj);
    Llamas.addT(obj).success(function (data) {
      $scope.message = "Task "+$scope.name+" added";
      $scope.taskobj= data.data;

      Llamas.getOne($scope.myuser._id).success(function (data) {
        $scope.userobj = data.data;

        $scope.userobj.pendingTasks.push($scope.taskobj._id)
        console.log($scope.userobj);
        console.log($scope.userobj.pendingTasks);
        Llamas.putOne($scope.userobj._id, $scope.userobj).success(function (data) {
          console.log("haha",$scope.userobj._id);
        }).error(function (data) {
          $scope.message = data.message;
        });
      }).error(function (data) {
        $scope.message = data.message;
      });

    }).error(function (data) {
      console.log(data);
      $scope.message = data.message;
    });


  }

}]);
mp4Controllers.controller('EditTaskController', ['$scope' ,'$routeParams', 'Llamas','$filter' , function($scope,$routeParams, Llamas, $filter) {
  $scope.id = $routeParams._id;

  $scope.date;
  $scope.message = "";
  $scope.des;
  $scope.name;

  $scope.myuser={};
  //original task and person
  $scope.taskobj;
  $scope.userobj;

  $(document).foundation();
  //get user list
  Llamas.getUsers().success(function (data) {
    $scope.users = data.data;
  }).error(function (data) {
    $scope.users = data.message;
  });
  //get current Task
  Llamas.getT($scope.id).success(function (data) {
    $scope.taskobj = data.data;
    $scope.name = $scope.taskobj.name;
    Llamas.getOne($scope.taskobj.assignedUser).success(function (data) {
      $scope.userobj=data.data;
      $scope.myuser=data.data;
      console.log($scope.userobj);
    }).error(function(data){
      console.log("error getting the assignee");
    });
    $scope.date= $filter('date')($scope.taskobj.deadline, "longDate");
  }).error(function (data) {
    $scope.message = data.message;
  });


  $scope.save = function() {
    $scope.taskobj.name = $scope.name;
    $scope.taskobj.description = $scope.des;
    $scope.taskobj.deadline = $scope.date;
    if($scope.taskobj.assignedUser != $scope.myuser.assignedUser){
      //delete

      var idx = $scope.userobj.pendingTasks.indexOf($scope.taskobj._id);
      if(idx > -1) {
        $scope.userobj.pendingTasks.splice(idx, 1);
        Llamas.putOne($scope.userobj._id, $scope.userobj).success(function (data) {
          console.log(data);
        }).error(function () {
          console.log("err while updating from user");
        });
      }
      //addnew
      if($scope.myuser.pendingTasks.indexOf($scope.taskobj._id) == -1) {
        $scope.myuser.pendingTasks.push($scope.taskobj._id);

        Llamas.putOne($scope.myuser._id, $scope.myuser).success(function (data) {
          console.log(data);
        }).error(function () {
          console.log("err while updating from user");
        });
      }

    }
    $scope.taskobj.assignedUser = $scope.myuser._id;
    $scope.taskobj.assignedUserName = $scope.myuser.name;
    Llamas.putT($scope.taskobj).success(function (data) {
      $scope.message = "Task "+$scope.name+" saved";
      $scope.taskobj= data.data;
      console.log($scope.taskobj);

    }).error(function (data) {
      $scope.message = data.message;
    });

  }

}]);
