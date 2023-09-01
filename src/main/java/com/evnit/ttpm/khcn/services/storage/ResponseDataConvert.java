package com.evnit.ttpm.khcn.services.storage;

import java.io.Serializable;

public class ResponseDataConvert implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean State;
	private String Message;
	private Object Data;

	public ResponseDataConvert() {
		// TODO Auto-generated constructor stub
	}

	public Boolean getState() {
		return State;
	}

	public void setState(Boolean state) {
		State = state;
	}

	public String getMessage() {
		return Message;
	}

	public void setMessage(String message) {
		Message = message;
	}

	public Object getData() {
		return Data;
	}

	public void setData(Object data) {
		Data = data;
	}

}
