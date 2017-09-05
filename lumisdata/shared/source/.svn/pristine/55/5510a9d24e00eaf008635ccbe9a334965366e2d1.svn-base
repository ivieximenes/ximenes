package br.com.qualicorp.redenarede.commons.utils;

import java.io.ByteArrayInputStream;
import java.nio.charset.Charset;

import org.apache.commons.codec.binary.Base64;

public final class FileUtils
{
	public static ByteArrayInputStream getByteArrayInputStream(String arquivoURL)
	{
		if (arquivoURL.startsWith("data:"))
		{
			int base64 = arquivoURL.indexOf(";base64,");
			
			if (base64 > 0)
				arquivoURL = arquivoURL.substring(base64 + ";base64,".length() );
		}
		
	    Base64 decoder = new Base64(true);
	    byte[] decodedBytes = decoder.decode(arquivoURL);
	    
	    return new ByteArrayInputStream(decodedBytes);
	}

	
	public static String base64UrlDecode(String arquivoURL, String charset)
	{
		if (arquivoURL.startsWith("data:"))
		{
			int base64 = arquivoURL.indexOf(";base64,");
			
			if (base64 > 0)
				arquivoURL = arquivoURL.substring(base64 + ";base64,".length() );
		}
		
	    String result = null;
	    Base64 decoder = new Base64(true);
	    byte[] decodedBytes = decoder.decode(arquivoURL);
	    
	    result = new String(decodedBytes, Charset.forName(charset));
	    
	    return result;
	}
}