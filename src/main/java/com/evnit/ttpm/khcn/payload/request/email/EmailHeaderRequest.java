package  com.evnit.ttpm.khcn.payload.request.email;

import java.io.Serializable;

public class EmailHeaderRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer id = 0;
	private Integer emailConfigurationId = 21;
	private String subject = "";
	private Boolean isRead = true;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getEmailConfigurationId() {
		return emailConfigurationId;
	}

	public void setEmailConfigurationId(Integer emailConfigurationId) {
		this.emailConfigurationId = emailConfigurationId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}
}
