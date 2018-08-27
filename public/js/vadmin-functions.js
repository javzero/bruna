/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});

/*
|--------------------------------------------------------------------------
| LISTS
|--------------------------------------------------------------------------
*/

// Set List Action Buttons
$(document).on("click", ".List-Checkbox", function (e) {
	e.stopPropagation();

	var selectedRows = [];
	$(".List-Checkbox:checked").each(function () {
		selectedRows.push($(this).attr('data-id'));
		$('#RowsToDeletion').val(selectedRows);
	});

	if (selectedRows.length == 1) {
		$('#EditId').val(selectedRows);
	} else if (selectedRows.length < 1) {
		$('#EditId').val('');
	} else if (selectedRows.length > 1) {
		$('#EditId').val('');
	} else {
		$('#EditId').val('');
	}

	showButtons(this);

	var checkbox = $(this).prop('checked');
	if (checkbox) {
		$(this).parent().parent().parent().addClass('row-selected');
	} else {
		$(this).parent().parent().parent().removeClass('row-selected');
	}
});

function showButtons(trigger) {

	var countSelected = $('.List-Checkbox:checkbox:checked').length;
	if (countSelected == 1) {
		$('.DeleteBtn').removeClass('Hidden');
		$('.EditBtn').removeClass('Hidden');
	} else if (countSelected >= 2) {
		$('.EditBtn').addClass('Hidden');
	} else if (countSelected == 0) {
		$('.DeleteBtn').addClass('Hidden');
		$('.EditBtn').addClass('Hidden');
	}
}

// Show Edit and Delete buttons in bottom if scrolled to mutch
$(document).scroll(function (e) {
	var scrollAmount = $(window).scrollTop();
	if (scrollAmount > 150) {
		$('.DeleteBtn').css({ "position": "fixed", "bottom": "50px", "right": "10px", "z-index": "999" });
		$('.EditBtn').css({ "position": "fixed", "bottom": "50px", "right": "130px", "z-index": "999" });
	} else {
		$('.DeleteBtn').css({ "position": "relative", "bottom": "auto", "right": "auto", "z-index": "999" });
		$('.EditBtn').css({ "position": "relative", "bottom": "auto", "right": "auto", "z-index": "999" });
	}
});

// Uncheck all checkboxes on reload.
function uncheckAll() {
	$('#TableList tbody .CheckBoxes').find('input[type="checkbox"]').each(function () {
		$(this).prop('checked', false);
	});
}
uncheckAll();

/*
|--------------------------------------------------------------------------
| FUNCTIONS
|--------------------------------------------------------------------------
*/

deleteRecord = function deleteRecord(id, route, bigtext, smalltext) {
	swal({
		title: bigtext,
		text: smalltext,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ELIMINAR',
		cancelButtonText: 'Cancelar',
		confirmButtonClass: 'btn btnGreen',
		cancelButtonClass: 'btn btnRed',
		buttonsStyling: false
	}).then(function () {

		$.ajax({
			url: route,
			method: 'POST',
			dataType: 'JSON',
			data: { id: id },
			beforeSend: function beforeSend() {
				// $('#Main-Loader').removeClass('Hidden');
			},
			success: function success(data) {
				$('#BatchDeleteBtn').addClass('Hidden');
				if (data.success == true) {
					$('#Id' + id).hide(200);
					for (i = 0; i < id.length; i++) {
						$('#Id' + id[i]).hide(200);
					}
					alert_ok('Ok!', 'Eliminación completa');
					console.log(data);
					return true;
				} else {
					alert_error('Ups!', 'Ha ocurrido un error (Puede que este registro tenga relación con otros items en el sistema). Debe eliminar primero los mismos.');
					console.log(data);
					return false;
				}
			},
			error: function error(data) {
				$('#Error').html(data.responseText);
				console.log(data);
			},
			complete: function complete() {
				// $('#Main-Loader').addClass('Hidden');
			}
		});
	});
};

deleteAndReload = function deleteAndReload(id, route, bigtext, smalltext) {
	swal({
		title: bigtext,
		text: smalltext,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ELIMINAR',
		cancelButtonText: 'Cancelar',
		confirmButtonClass: 'btn btnGreen',
		cancelButtonClass: 'btn btnRed',
		buttonsStyling: false
	}).then(function () {
		$.ajax({
			url: route,
			method: 'POST',
			dataType: 'JSON',
			data: { id: id },
			beforeSend: function beforeSend() {
				// $('#Main-Loader').removeClass('Hidden');
			},
			success: function success(data) {
				$('#BatchDeleteBtn').addClass('Hidden');
				if (data.success == true) {
					// alert_ok('Ok!','Eliminación completa');
					location.reload();
				} else {
					alert_error('Ups!', 'Ha ocurrido un error (Puede que este registro tenga relación con otros items en el sistema). Debe eliminar primero los mismos.');
					console.log(data);
					return false;
				}
			},
			error: function error(data) {
				$('#Error').html(data.responseText);
				console.log(data);
			}
		});
	});
};

/*
|--------------------------------------------------------------------------
| ALERTS
|--------------------------------------------------------------------------
*/

function alert_ok(bigtext, smalltext) {
	swal(bigtext, smalltext, 'success');
}

function alert_error(bigtext, smalltext) {
	swal(bigtext, smalltext, 'error');
}

function alert_info(bigtext, smalltext) {

	swal({
		title: bigtext,
		type: 'info',
		html: smalltext,
		showCloseButton: true,
		showCancelButton: false,
		confirmButtonText: '<i class="ion-checkmark-round"></i> Ok!'
	});
}

function closeParent() {
	$(this).parent('hide');
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmJlNTU5YTg5NTc5MGIzMGI0OWMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy92YWRtaW4tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbIiQiLCJhamF4U2V0dXAiLCJoZWFkZXJzIiwiYXR0ciIsImRvY3VtZW50Iiwib24iLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwic2VsZWN0ZWRSb3dzIiwiZWFjaCIsInB1c2giLCJ2YWwiLCJsZW5ndGgiLCJzaG93QnV0dG9ucyIsImNoZWNrYm94IiwicHJvcCIsInBhcmVudCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJ0cmlnZ2VyIiwiY291bnRTZWxlY3RlZCIsInNjcm9sbCIsInNjcm9sbEFtb3VudCIsIndpbmRvdyIsInNjcm9sbFRvcCIsImNzcyIsInVuY2hlY2tBbGwiLCJmaW5kIiwiZGVsZXRlUmVjb3JkIiwiaWQiLCJyb3V0ZSIsImJpZ3RleHQiLCJzbWFsbHRleHQiLCJzd2FsIiwidGl0bGUiLCJ0ZXh0IiwidHlwZSIsInNob3dDYW5jZWxCdXR0b24iLCJjb25maXJtQnV0dG9uQ29sb3IiLCJjYW5jZWxCdXR0b25Db2xvciIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImNvbmZpcm1CdXR0b25DbGFzcyIsImNhbmNlbEJ1dHRvbkNsYXNzIiwiYnV0dG9uc1N0eWxpbmciLCJ0aGVuIiwiYWpheCIsInVybCIsIm1ldGhvZCIsImRhdGFUeXBlIiwiZGF0YSIsImJlZm9yZVNlbmQiLCJzdWNjZXNzIiwiaGlkZSIsImkiLCJhbGVydF9vayIsImNvbnNvbGUiLCJsb2ciLCJhbGVydF9lcnJvciIsImVycm9yIiwiaHRtbCIsInJlc3BvbnNlVGV4dCIsImNvbXBsZXRlIiwiZGVsZXRlQW5kUmVsb2FkIiwibG9jYXRpb24iLCJyZWxvYWQiLCJhbGVydF9pbmZvIiwic2hvd0Nsb3NlQnV0dG9uIiwiY2xvc2VQYXJlbnQi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O0FBQ2pDQyxNQUNJRixPQURKLEVBRUlDLFNBRkosRUFHSSxTQUhKO0FBS0g7O0FBRUQsU0FBUzBCLFdBQVQsQ0FBcUIzQixPQUFyQixFQUE4QkMsU0FBOUIsRUFBd0M7QUFDcENDLE1BQ0lGLE9BREosRUFFSUMsU0FGSixFQUdJLE9BSEo7QUFLSDs7QUFFRCxTQUFTa0MsVUFBVCxDQUFvQm5DLE9BQXBCLEVBQTZCQyxTQUE3QixFQUF1Qzs7QUFFbkNDLE1BQUs7QUFDR0MsU0FBT0gsT0FEVjtBQUVESyxRQUFNLE1BRkw7QUFHRHdCLFFBQU01QixTQUhMO0FBSURtQyxtQkFBaUIsSUFKaEI7QUFLRDlCLG9CQUFrQixLQUxqQjtBQU1ERyxxQkFDSTtBQVBILEVBQUw7QUFTSDs7QUFHRCxTQUFTNEIsV0FBVCxHQUFzQjtBQUNyQnBFLEdBQUUsSUFBRixFQUFRZ0IsTUFBUixDQUFlLE1BQWY7QUFDQSxDIiwiZmlsZSI6Ii9qcy92YWRtaW4tZnVuY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZiZTU1OWE4OTU3OTBiMzBiNDljIiwiJC5hamF4U2V0dXAoe1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAgICdYLUNTUkYtVE9LRU4nOiAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpXHJcbiAgICB9XHJcbn0pO1xyXG4gXHJcbi8qXHJcbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG58IExJU1RTXHJcbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuLy8gU2V0IExpc3QgQWN0aW9uIEJ1dHRvbnNcclxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIi5MaXN0LUNoZWNrYm94XCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0dmFyIHNlbGVjdGVkUm93cyA9IFtdO1xyXG4gICAgJChcIi5MaXN0LUNoZWNrYm94OmNoZWNrZWRcIikuZWFjaChmdW5jdGlvbigpIHsgICAgICAgICAgXHJcbiAgICAgICAgc2VsZWN0ZWRSb3dzLnB1c2goJCh0aGlzKS5hdHRyKCdkYXRhLWlkJykpO1xyXG5cdFx0JCgnI1Jvd3NUb0RlbGV0aW9uJykudmFsKHNlbGVjdGVkUm93cyk7XHJcbiAgICB9KTtcclxuICAgICAgIFxyXG4gICAgaWYoc2VsZWN0ZWRSb3dzLmxlbmd0aCA9PSAxKXtcclxuICAgICAgICAkKCcjRWRpdElkJykudmFsKHNlbGVjdGVkUm93cyk7XHJcbiAgICB9IGVsc2UgaWYoc2VsZWN0ZWRSb3dzLmxlbmd0aCA8IDEpe1xyXG4gICAgICAgICQoJyNFZGl0SWQnKS52YWwoJycpO1xyXG4gICAgfSBlbHNlIGlmKHNlbGVjdGVkUm93cy5sZW5ndGggPiAxKXtcclxuICAgICAgICAkKCcjRWRpdElkJykudmFsKCcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgnI0VkaXRJZCcpLnZhbCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0J1dHRvbnModGhpcyk7XHJcblxyXG5cdHZhciBjaGVja2JveCA9ICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xyXG5cdGlmKGNoZWNrYm94KXtcclxuXHRcdCQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ3Jvdy1zZWxlY3RlZCcpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdyb3ctc2VsZWN0ZWQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHNob3dCdXR0b25zKHRyaWdnZXIpIHtcclxuXHRcclxuXHR2YXIgY291bnRTZWxlY3RlZCA9ICQoJy5MaXN0LUNoZWNrYm94OmNoZWNrYm94OmNoZWNrZWQnKS5sZW5ndGg7XHJcblx0aWYoY291bnRTZWxlY3RlZCA9PSAxKSB7XHJcbiAgICAgICAgJCgnLkRlbGV0ZUJ0bicpLnJlbW92ZUNsYXNzKCdIaWRkZW4nKTtcclxuXHRcdCQoJy5FZGl0QnRuJykucmVtb3ZlQ2xhc3MoJ0hpZGRlbicpO1xyXG5cdFx0XHJcblx0fSBlbHNlIGlmKGNvdW50U2VsZWN0ZWQgPj0gMikge1xyXG4gICAgICAgICQoJy5FZGl0QnRuJykuYWRkQ2xhc3MoJ0hpZGRlbicpO1xyXG4gICAgfSBlbHNlIGlmKGNvdW50U2VsZWN0ZWQgPT0gMCkge1xyXG4gICAgICAgICQoJy5EZWxldGVCdG4nKS5hZGRDbGFzcygnSGlkZGVuJyk7XHJcbiAgICAgICAgJCgnLkVkaXRCdG4nKS5hZGRDbGFzcygnSGlkZGVuJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFNob3cgRWRpdCBhbmQgRGVsZXRlIGJ1dHRvbnMgaW4gYm90dG9tIGlmIHNjcm9sbGVkIHRvIG11dGNoXHJcbiQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbihlKXtcclxuXHR2YXIgc2Nyb2xsQW1vdW50ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cdGlmKHNjcm9sbEFtb3VudCA+IDE1MCl7XHJcblx0XHQkKCcuRGVsZXRlQnRuJykuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcImJvdHRvbVwiOlwiNTBweFwiLCBcInJpZ2h0XCI6XCIxMHB4XCIsIFwiei1pbmRleFwiOlwiOTk5XCJ9KTtcclxuXHRcdCQoJy5FZGl0QnRuJykuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcImJvdHRvbVwiOlwiNTBweFwiLCBcInJpZ2h0XCI6XCIxMzBweFwiLCBcInotaW5kZXhcIjpcIjk5OVwifSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdCQoJy5EZWxldGVCdG4nKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCIsIFwiYm90dG9tXCI6XCJhdXRvXCIsIFwicmlnaHRcIjpcImF1dG9cIiwgXCJ6LWluZGV4XCI6XCI5OTlcIn0pO1xyXG5cdFx0JCgnLkVkaXRCdG4nKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCIsIFwiYm90dG9tXCI6XCJhdXRvXCIsIFwicmlnaHRcIjpcImF1dG9cIiwgXCJ6LWluZGV4XCI6XCI5OTlcIn0pO1xyXG5cdH1cclxufSk7XHJcblxyXG4vLyBVbmNoZWNrIGFsbCBjaGVja2JveGVzIG9uIHJlbG9hZC5cclxuZnVuY3Rpb24gdW5jaGVja0FsbCgpe1xyXG5cdCQoJyNUYWJsZUxpc3QgdGJvZHkgLkNoZWNrQm94ZXMnKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1x0XHJcblx0fSk7XHRcclxufVxyXG51bmNoZWNrQWxsKCk7XHJcblxyXG4vKlxyXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxufCBGVU5DVElPTlNcclxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG5kZWxldGVSZWNvcmQgPSBmdW5jdGlvbihpZCwgcm91dGUsIGJpZ3RleHQsIHNtYWxsdGV4dCkge1xyXG5cdHN3YWwoe1xyXG5cdFx0dGl0bGU6IGJpZ3RleHQsXHJcblx0XHR0ZXh0OiBzbWFsbHRleHQsXHJcblx0XHR0eXBlOiAnd2FybmluZycsXHJcblx0XHRzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG5cdFx0Y29uZmlybUJ1dHRvbkNvbG9yOiAnIzMwODVkNicsXHJcblx0XHRjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxyXG5cdFx0Y29uZmlybUJ1dHRvblRleHQ6ICdFTElNSU5BUicsXHJcblx0XHRjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsYXInLFxyXG5cdFx0Y29uZmlybUJ1dHRvbkNsYXNzOiAnYnRuIGJ0bkdyZWVuJyxcclxuXHRcdGNhbmNlbEJ1dHRvbkNsYXNzOiAnYnRuIGJ0blJlZCcsXHJcblx0XHRidXR0b25zU3R5bGluZzogZmFsc2VcclxuXHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiBcdFx0JC5hamF4KHtcclxuXHRcdFx0dXJsOiByb3V0ZSxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsICAgICAgICAgICAgIFxyXG5cdFx0XHRkYXRhVHlwZTogJ0pTT04nLFxyXG5cdFx0XHRkYXRhOiB7IGlkOiBpZCB9LFxyXG5cdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vICQoJyNNYWluLUxvYWRlcicpLnJlbW92ZUNsYXNzKCdIaWRkZW4nKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0JCgnI0JhdGNoRGVsZXRlQnRuJykuYWRkQ2xhc3MoJ0hpZGRlbicpO1xyXG5cdFx0XHRcdGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0JCgnI0lkJytpZCkuaGlkZSgyMDApO1xyXG5cdFx0XHRcdFx0Zm9yKGk9MDsgaSA8IGlkLmxlbmd0aCA7IGkrKyl7XHJcblx0XHRcdFx0XHRcdCQoJyNJZCcraWRbaV0pLmhpZGUoMjAwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGFsZXJ0X29rKCdPayEnLCdFbGltaW5hY2nDs24gY29tcGxldGEnKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGFsZXJ0X2Vycm9yKCdVcHMhJywnSGEgb2N1cnJpZG8gdW4gZXJyb3IgKFB1ZWRlIHF1ZSBlc3RlIHJlZ2lzdHJvIHRlbmdhIHJlbGFjacOzbiBjb24gb3Ryb3MgaXRlbXMgZW4gZWwgc2lzdGVtYSkuIERlYmUgZWxpbWluYXIgcHJpbWVybyBsb3MgbWlzbW9zLicpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oZGF0YSlcclxuXHRcdFx0e1xyXG4gICAgICAgICAgICAgICAgJCgnI0Vycm9yJykuaHRtbChkYXRhLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHRcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vICQoJyNNYWluLUxvYWRlcicpLmFkZENsYXNzKCdIaWRkZW4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG5kZWxldGVBbmRSZWxvYWQgPSBmdW5jdGlvbihpZCwgcm91dGUsIGJpZ3RleHQsIHNtYWxsdGV4dCkge1xyXG5cdHN3YWwoe1xyXG5cdFx0dGl0bGU6IGJpZ3RleHQsXHJcblx0XHR0ZXh0OiBzbWFsbHRleHQsXHJcblx0XHR0eXBlOiAnd2FybmluZycsXHJcblx0XHRzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG5cdFx0Y29uZmlybUJ1dHRvbkNvbG9yOiAnIzMwODVkNicsXHJcblx0XHRjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxyXG5cdFx0Y29uZmlybUJ1dHRvblRleHQ6ICdFTElNSU5BUicsXHJcblx0XHRjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsYXInLFxyXG5cdFx0Y29uZmlybUJ1dHRvbkNsYXNzOiAnYnRuIGJ0bkdyZWVuJyxcclxuXHRcdGNhbmNlbEJ1dHRvbkNsYXNzOiAnYnRuIGJ0blJlZCcsXHJcblx0XHRidXR0b25zU3R5bGluZzogZmFsc2VcclxuXHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdHVybDogcm91dGUsXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLCAgICAgICAgICAgICBcclxuXHRcdFx0ZGF0YVR5cGU6ICdKU09OJyxcclxuXHRcdFx0ZGF0YTogeyBpZDogaWQgfSxcclxuXHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQvLyAkKCcjTWFpbi1Mb2FkZXInKS5yZW1vdmVDbGFzcygnSGlkZGVuJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdCQoJyNCYXRjaERlbGV0ZUJ0bicpLmFkZENsYXNzKCdIaWRkZW4nKTtcclxuXHRcdFx0XHRpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcclxuXHRcdFx0XHRcdC8vIGFsZXJ0X29rKCdPayEnLCdFbGltaW5hY2nDs24gY29tcGxldGEnKTtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhbGVydF9lcnJvcignVXBzIScsJ0hhIG9jdXJyaWRvIHVuIGVycm9yIChQdWVkZSBxdWUgZXN0ZSByZWdpc3RybyB0ZW5nYSByZWxhY2nDs24gY29uIG90cm9zIGl0ZW1zIGVuIGVsIHNpc3RlbWEpLiBEZWJlIGVsaW1pbmFyIHByaW1lcm8gbG9zIG1pc21vcy4nKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGRhdGEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkKCcjRXJyb3InKS5odG1sKGRhdGEucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcdFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG58IEFMRVJUU1xyXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGFsZXJ0X29rKGJpZ3RleHQsIHNtYWxsdGV4dCl7XHJcbiAgICBzd2FsKFxyXG4gICAgICAgIGJpZ3RleHQsXHJcbiAgICAgICAgc21hbGx0ZXh0LFxyXG4gICAgICAgICdzdWNjZXNzJ1xyXG4gICAgKTsgICAgXHJcbn1cclxuICAgIFxyXG5mdW5jdGlvbiBhbGVydF9lcnJvcihiaWd0ZXh0LCBzbWFsbHRleHQpe1xyXG4gICAgc3dhbChcclxuICAgICAgICBiaWd0ZXh0LFxyXG4gICAgICAgIHNtYWxsdGV4dCxcclxuICAgICAgICAnZXJyb3InXHJcbiAgICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhbGVydF9pbmZvKGJpZ3RleHQsIHNtYWxsdGV4dCl7XHJcblxyXG4gICAgc3dhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiBiaWd0ZXh0LFxyXG4gICAgICAgIHR5cGU6ICdpbmZvJyxcclxuICAgICAgICBodG1sOiBzbWFsbHRleHQsXHJcbiAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OlxyXG4gICAgICAgICAgICAnPGkgY2xhc3M9XCJpb24tY2hlY2ttYXJrLXJvdW5kXCI+PC9pPiBPayEnXHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjbG9zZVBhcmVudCgpe1xyXG5cdCQodGhpcykucGFyZW50KCdoaWRlJyk7XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9hc3NldHMvanMvdmFkbWluLWZ1bmN0aW9ucy5qcyJdLCJzb3VyY2VSb290IjoiIn0=