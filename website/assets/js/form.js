const formUrl = "/mail";const handleForm = function(e){    e.preventDefault();    $(e.target).hide();    $('#formFeedback').html('<i class="fa fa-spinner fa-spin"></i> Bericht wordt verstuurd... ');    postForm(this);};const formFeedback = function(responseText){    console.log(responseText);    $('#formFeedback').html(responseText);};const postForm = function(data){    $.post(formUrl, $(data).serialize())    .done(formFeedback);};$(function(){    $("#membershipForm").on('submit', handleForm);    $("#contactForm").on('submit', handleForm);});