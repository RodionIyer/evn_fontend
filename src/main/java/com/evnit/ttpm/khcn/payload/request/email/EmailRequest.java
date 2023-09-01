package com.evnit.ttpm.khcn.payload.request.email;

import java.io.Serializable;

public class EmailRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String fromEmail = "hrms@evn.com.vn";
	private String[] recipients;
	private String subject;
	private String body;
	private String inReplyTo = "0";
	private Boolean isRead = true;
	private Integer emailHeaderId = 0;
	private Integer emailTypeId = 0;
	private EmailHeaderRequest emailHeader;

	public String getFromEmail() {
		return fromEmail;
	}

	public void setFromEmail(String fromEmail) {
		this.fromEmail = fromEmail;
	}

	public String[] getRecipients() {
		return recipients;
	}

	public void setRecipients(String[] recipients) {
		this.recipients = recipients;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getInReplyTo() {
		return inReplyTo;
	}

	public void setInReplyTo(String inReplyTo) {
		this.inReplyTo = inReplyTo;
	}

	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}

	public Integer getEmailHeaderId() {
		return emailHeaderId;
	}

	public void setEmailHeaderId(Integer emailHeaderId) {
		this.emailHeaderId = emailHeaderId;
	}

	public Integer getEmailTypeId() {
		return emailTypeId;
	}

	public void setEmailTypeId(Integer emailTypeId) {
		this.emailTypeId = emailTypeId;
	}

	public EmailHeaderRequest getEmailHeader() {
		return emailHeader;
	}

	public void setEmailHeader(EmailHeaderRequest emailHeader) {
		this.emailHeader = emailHeader;
	}

}
