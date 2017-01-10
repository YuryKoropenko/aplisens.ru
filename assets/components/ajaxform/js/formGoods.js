var AjaxForm = {

	initialize: function(afConfig) {
		if(!jQuery().ajaxForm) {
			document.write('<script src="'+afConfig.assetsUrl+'js/lib/jquery.form.min.js"><\/script>');
		}
		if(!jQuery().jGrowl) {
			document.write('<script src="'+afConfig.assetsUrl+'js/lib/jquery.jgrowl.min.js"><\/script>');
		}

		$(document).ready(function() {
			$.jGrowl.defaults.closerTemplate = '<div>[ '+afConfig.closeMessage+' ]</div>';
		});

		$(document).on('submit', afConfig.formSelector, function(e) {
			$(this).ajaxSubmit({
				dataType: 'json'
				,data: {pageId: afConfig.pageId}
				,url: afConfig.actionUrl
				,beforeSerialize: function(form, options) {
					form.find(':submit').each(function() {
						if (!form.find('input[type="hidden"][name="' + $(this).attr('name') + '"]').length) {
							$(form).append(
								$('<input type="hidden">').attr({
									name: $(this).attr('name'),
									value: $(this).attr('value')
								})
							);
						}
					})
				}
				,beforeSubmit: function(fields, form) {
					if (typeof(afValidated) != 'undefined' && afValidated == false) {
						return false;
					}
					form.find('.error').html('');
					form.find('.error').removeClass('error');
					form.find('input,textarea,select,button').attr('disabled', true);
					return true;
				}
				,success: function(response, status, xhr, form) {
					form.find('input,textarea,select,button').attr('disabled', false);
					response.form=form;
					$(document).trigger('af_complete', response);
					if (!response.success) {
						AjaxForm.Message.error(response.message);
						if (response.data) {
							var key, value;
							for (key in response.data) {
								if (response.data.hasOwnProperty(key)) {
									value = response.data[key];
									form.find('.error_' + key).html(value).addClass('error');
									form.find('[name="' + key + '"]').addClass('error');
								}
							}
						}
					}
					else {						
						$.arcticmodal('close');						
						var c = '<div class="box-modal success-modal"><div class="box-modal_close arcticmodal-close"><i class="icon-cross"></i></div>'
									+ '<div class="modal-content">'
										+ '<p class="modal-title">Отправка формы</p>' 
										+ '<div class="consult-form">'
											+ '<span class="success_form_mess">'+response.message+ '</span>'
										+ '</div>'
									+ '</div>'
								+'</div>';
						$.arcticmodal({
							overlay: {
								css: {
									background: 'rgba(255,255,255, .8)' 
								}
							},							
							content: c
						});
						setTimeout("$.arcticmodal('close')", 6000);
//						AjaxForm.Message.success(response.message, form);
						form.find('.error').removeClass('error');
						form[0].reset();
					}
				}
			});
			e.preventDefault();
			return false;
		});

		$(document).on('reset', afConfig.formSelector, function(e) {
			$(this).find('.error').html('');
			AjaxForm.Message.close();
		});
	}

};


AjaxForm.Message = {
	success: function(message, sticky) {
		if (message) {
//                    $('.success_form_mess').html(message);
//			if (!sticky) {sticky = false;}
//			$.jGrowl(message, {theme: 'af-message-success', sticky: sticky});
		}
	}
	,error: function(message, sticky) {
//		if (message) {
//			if (!sticky) {sticky = false;}
//			$.jGrowl(message, {theme: 'af-message-error', sticky: sticky});
//		}
	}
	,info: function(message, sticky) {
//		if (message) {
//			if (!sticky) {sticky = false;}
//			$.jGrowl(message, {theme: 'af-message-info', sticky: sticky});
//		}
	}
	,close: function() {
//		$.jGrowl('close');
	}
};

$( document ).ready(function() {
    $( document ).on('click','.js_cost',clearSuccess);
    $( document ).on('click','.js_doc',clearSuccess);
    $( document ).on('click','.js_consult',clearSuccess);
});

var clearSuccess = function(){
    $('.success_form_mess').html('');
};
