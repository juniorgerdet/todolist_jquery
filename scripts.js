/**
* @fileoverview Scripts Principal
*
* @author Junior Gerdet
* @email juniorgerdet@gmail.com
* @version 0.1
*/

/* Patron de Diseño */
// Declaracion de Variables Globales Pasadas a la funcion Modelo, la misma nos permite encapsulamiento con clousure
var to = to || {}, info = JSON.parse(localStorage.getItem("infoTasks"));
info = info || {};

(function (to, info, $) {
    // Variables de ambito
    var flag;
    var tmpText;

    /* Eventos sobre elementos HTML */

	$("#addnew").click(function (event) {
        $(".linew").fadeIn("fast", 
            function() {
                $("#input-task").focus();
                foundShow();
            }
        );
	})


    $("#tasksList").click(function (event) {
        to.Load();
        $(".linew").fadeOut("fast");
    })


	$("#input-task").blur(function (event) {
		if(!this.value.trim()){
			$(".linew").fadeOut("fast");
		}

        foundShow();
	})

	$('#form').submit(function (e) {
        var taskName = this.elements[0];
        if(taskName.value){
            var Id = new Date().getTime();
            var tmpData = {
                id : Id,
                taskname: taskName.value,
                done: false
            };
            info[Id] = tmpData;
            localStorage.setItem("infoTasks", JSON.stringify(info));
            createItem(tmpData);
            $(".linew").hide();
            // $(".linew").fadeOut("fast");
            taskName.value="";
        }
		e.preventDefault();
	});


    // Acciones de CRUD de los Taks sobre la persistencia local (localStorage)
    to.editTask = function (id) {
        // Updating local storage
        tmpText=$("#task-"+id+" label").text();
        $("#task-"+id+" .edit").hide();
        $("#task-"+id+" label").hide();
        $("#task-"+id+" .edit-input").show().val(tmpText).focus();
    };

    to.saveTask = function (id, e) {
        // Updating local storage
        var event = window.event ? window.event : e;
        if (event.keyCode == 13) { 
            tmpText=$("#task-"+id+" .edit-input").val();
            $("#task-"+id+" .edit-input").hide().val("");
            $("#task-"+id+" .edit").removeAttr("style");
            $("#task-"+id+" label").text(tmpText).show();
            $("#task-"+id).toggleClass("two");
            info[id].taskname=tmpText;
            localStorage.setItem("infoTasks", JSON.stringify(info)); 
            setTimeout(function() {
                $("#task-"+id).removeClass("two");
            },700)
            tmpText="";
        }

        if (event.keyCode == 27) { 
            to.removeTask(id);
        }

        foundShow();  
        
    };

    // Remove task
    to.doneTask = function (id) {
        // Updating local storage
        if(!$("#task-"+id+" label").hasClass("done")){
            info[id].done=true;
            localStorage.setItem("infoTasks", JSON.stringify(info)); 
            $("#task-"+id+" label").addClass("done");
            $("#task-"+id+" .edit").css("display", "none")
        }else{
            info[id].done=false;
            localStorage.setItem("infoTasks", JSON.stringify(info)); 
            $("#task-"+id+" .edit").removeAttr("style");
            $("#task-"+id+" label").removeClass("done");
        }
    };

    // Remove task
    to.removeTask = function (id) {
        // Updating local storage
        if($("#task-"+id+" label").is(":visible")){
            delete info[id];
            localStorage.setItem("infoTasks", JSON.stringify(info)); 
            $("#task-"+id).remove();
        }else{
            $("#task-"+id+" .edit-input").hide().val("");
            $("#task-"+id+" .edit").removeAttr("style");
            tmpText=$("#task-"+id+" label").text();
            $("#task-"+id+" label").text(tmpText).show();
            tmpText="";
        }

        foundShow();
    };

    function foundShow() {
        console.log(Object.keys(info).length);
        if(!Object.keys(info).length){
            $(".linot").show();
        }else{
            $(".linot").hide();
        }
    }

    // Funcion que permite crear elementos html y agregarlos a la lista de tareas
    function createItem(data) {
        var ulwrap=$(".todo-list"), liwrap, divwrap, labelwrap;  
        liwrap = $("<li />", {
            "id" : "task-"+ data.id,
            "data" : data.id
        }).appendTo(ulwrap);

        var divwrap=$("<div />", {
            "class" : "view",
            "ondblclick" : "to.doneTask("+data.id+")",
        }).appendTo(liwrap).fadeIn(1000);

        $("<span />", {
            "class": "vignette"
        }).appendTo(divwrap);
        var lclass=(data.done)?"done noselect":"noselect";
        $("<label />", {
            "text": data.taskname,
            "class": lclass
        }).appendTo(divwrap);

        $("<input />", {
            "class": "edit-input",
            "placeholder": "Edit your task...",
            "onkeypress": "to.saveTask("+data.id+")",
            "onkeyup": "to.saveTask("+data.id+")"
        }).appendTo(divwrap);
        
        $("<button />", {
            "class": "destroy",
            "onclick": "to.removeTask("+data.id+")"
        }).appendTo(divwrap);

        var bstyle=(data.done)?"display:none":"";
         $("<button />", {
            "class": "edit ion-edit",
            "style": bstyle,
            "onclick": "to.editTask("+data.id+", event)"
        }).appendTo(divwrap);
             $( ".todo-list" ).sortable({
            
            }).disableSelection();

    }

    // La siguiente funcion carga todas las tareas contenidas en la persistencia local de navegador (localStorage)
    to.Load = function () {
       
        
        if(Object.keys(info).length){
            $.each(info, function (index, item) {
                createItem(item);
            });
        }else{
            $(".linot").show();
        }
    }


})(to, info, jQuery);
