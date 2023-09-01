package com.evnit.ttpm.khcn.services.mail;


import com.evnit.ttpm.khcn.models.service.Mail;

public interface MailService
{
	public void sendEmail(Mail mail) throws Exception;
	public void GetSendMailDB(String token);
}
