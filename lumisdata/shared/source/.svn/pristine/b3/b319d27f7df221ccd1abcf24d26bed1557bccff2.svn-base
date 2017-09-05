package br.com.qualicorp.redenarede.commons.utils;

import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class StringUtils
{
	public static final String PASSWORD_SPECIAL_LETTERS = "!@#$*,?";
	public static final String ADDRESS_NUMBER_SPECIAL_LETTERS = "!@#$*,?";
	
	public static boolean isBlankOrNull(String arg)
	{
		if (arg == null)
			return true;
		
		for (int i = 0; i < arg.length(); i++)
		{
			if (arg.charAt(i) != ' ')
				return false;
		}
		
		return true;
	}
	
	public static boolean equals(String var1, String var2)
	{
		if (var1 == null && var2 == null)
			return true;
		else if (var1 != null && var2 == null)
			return false;
		else if (var1 == null && var2 != null)
			return false;
		
		return var1.equals(var2);
	}
	
	public static boolean hasUppercase(String str)
	{
		if (str == null)
			return false;
		
	    for(int i = 0; i < str.length(); i++)
	    {
	        if(Character.isUpperCase(str.charAt(i)))
	        	return true;
	    }
	    
	    return false;
	}
	
	public static boolean hasLowerCase(String str)
	{
		if (str == null)
			return false;
		
	    for(int i = 0; i < str.length(); i++)
	    {
	        if(Character.isLowerCase(str.charAt(i)))
	        	return true;
	    }
	    
	    return false;
	}
	
	public static boolean hasNumeric(String str)
	{
		if (str == null)
			return false;
		
	    for(int i = 0; i < str.length(); i++)
	    {
	        if(Character.isDigit(str.charAt(i)))
	        	return true;
	    }
	    
	    return false;
	}
	
	public static boolean hasPasswordSpecialLetter(String str)
	{
		if (str == null)
			return false;
		
	    for(int i = 0; i < str.length(); i++)
	    {
	        if(PASSWORD_SPECIAL_LETTERS.indexOf(str.charAt(i)) > -1)
	        	return true;
	    }
	    
	    return false;
	}
	
	public static boolean hasAddressNumberSpecialLetter(String str)
	{
		if (str == null)
			return false;
		
	    for(int i = 0; i < str.length(); i++)
	    {
	        if(ADDRESS_NUMBER_SPECIAL_LETTERS.indexOf(str.charAt(i)) > -1)
	        	return true;
	    }
	    
	    return false;
	}
	
	public static String formatMoneyBr(Number valor)
	{
		NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
		
		return formatter.format(valor).substring(3);
	}
	
	public static String formatPhone(String telefone)
	{
		if (telefone == null)
			return null;
		
		String telefoneAux = telefone.replaceAll("\\D", "");
		
		if (telefoneAux.length() == 10)
		{
			return "(" + telefoneAux.substring(0, 2) + ") " + telefoneAux.substring(2, 6) + "-" + telefoneAux.substring(6);
		}
		
		return "(" + telefoneAux.substring(0, 2) + ") " + telefoneAux.substring(2, 7) + "-" + telefoneAux.substring(7);
	}

	public static List<String> getList(String... args)
	{
		List<String> list = new ArrayList<String>();
		
		if (args == null)
			return list;
		
		for (String str : args)
		{
			list.add(str);
		}
		
		return list;
	}
	
	public static String normalize(String text)
	{
		if (text == null)
			return null;
		
		return Normalizer.normalize(text, Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
	}
	
	public static String normalizeUpper(String text)
	{
		if (text == null)
			return null;
		
		return Normalizer.normalize(text, Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase();
	}
	
	public static String cutStringTrim(String str, int length)
	{
		if (str == null)
			return str;
		
		if (str.length() <= length)
			return str;
		
		return str.substring(0, length).trim();
	}
	
	public static void main(String[] ars)
	{
		System.out.println(cutStringTrim("12345    6    ", 5));
	}
	
	public static String replaceContentXMLTags(String xml, String newValue, String... tagsName)
	{
		if (xml == null)
			return null;
		
		for (String tagName : tagsName)
			xml = xml.replaceAll("(<" + tagName + "[^>]*>?).*?(</" + tagName + ">?)", "$1" + newValue + "$2");
		
		return replaceContentXMLTagsWithNameSpace(xml, newValue, tagsName);
	}
	
	private static String replaceContentXMLTagsWithNameSpace(String xml, String newValue, String... tagsName)
	{
		if (xml == null)
			return null;
		
		for (String tagName : tagsName)
			xml = xml.replaceAll("(<[^:]*:" + tagName + "[^>]*>?).*?(</[^:]*:" + tagName + ">?)", "$1" + newValue + "$2");
		
		return xml;
	}
}