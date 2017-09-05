package br.com.qualicorp.redenarede.commons.exceptions;

public class ManageGSPException extends Exception
{
	private static final long serialVersionUID = 1L;

	public ManageGSPException(String message)
	{
		super(message);
	}

	public ManageGSPException(String message, Throwable cause)
	{
		super(message, cause);
	}
}