package br.com.qualicorp.redenarede.commons.csv;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import br.com.qualicorp.redenarede.commons.exceptions.ManageGSPException;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;


public class CSVUtils
{
	public static final String CSV_DIVISOR_COLUMN = ";";
	private static final String CHARSET_FILE = "ISO-8859-1";
	public static String IGNORE_LINE_CODE = "#";
	
	public static String parse( List<?> objects, boolean printHeader ) throws IllegalAccessException
	{
		StringBuilder sb  = new StringBuilder();
		
		if (printHeader)
			printHeader( objects, sb );
		
		for (Object obj : objects)
		{
			Field[] fields = obj.getClass().getDeclaredFields();
			
			for( Field field : fields )
			{
				field.setAccessible(true);
				
				ColumnCSV column = field.getAnnotation( ColumnCSV.class );
				
				if( column != null )
				{
					Object value = field.get(obj);
					sb.append( value != null ? value : "").append(CSV_DIVISOR_COLUMN).append(" ");
				}
			}
			
			sb.append("\n");
		}
		
		return sb.toString();
	}
	
	private static String printHeader(  List<?> objects, StringBuilder sb )
	{
		Object obj = objects.get(0);
		
		Field[] fields = obj.getClass().getDeclaredFields();
		
		for( Field field : fields )
		{
			field.setAccessible(true);
			
			ColumnCSV column = field.getAnnotation( ColumnCSV.class );
			
			if( column != null )
			{
				sb.append( column.label() + CSV_DIVISOR_COLUMN + " " );
			}
		}
		
		sb.append("\n");
		
		
		return sb.toString();
	}
	
	/**
	 * A primeira linha é zero! Como um array!
	 * @throws ManageGSPException 
	 * @throws IOException 
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public static <T> List<T> parse(File file, int firstLine, Class<T> clazz) throws ManageGSPException
	{
		try
		{
			return parse(file, firstLine, clazz, CHARSET_FILE);
		}
		catch (IllegalArgumentException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (SecurityException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (IOException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
	}

	
	/**
	 * A primeira linha é zero! Como um array!
	 * @throws ManageGSPException 
	 */
	public static <T> List<T> parse(File file, int firstLine, Class<T> clazz, String charsetName) throws IOException, ManageGSPException
	{
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), charsetName));
		
		try
		{
			return parse(br, firstLine, clazz, charsetName);
		}
		finally
		{
			br.close();
		}
	}
	
	public static <T> List<T> parse(BufferedReader br, int firstLine, Class<T> clazz, String charsetName) throws IOException, ManageGSPException
	{
		List<T> list = new ArrayList<T>();
		
		String line = null;
		int lineCount = 0;
		
		List<Field> fields = getValidsFieldsToImport(clazz.getDeclaredFields());
		Field varArgField = getVarArgField(clazz.getDeclaredFields());
		List<Field> varArgFields = null;
		
		if (varArgField != null)
			varArgFields = getValidsFieldsToImport(getFirstGenericClass(varArgField).getDeclaredFields());
		
		while ((line = br.readLine()) != null)
		{
			if (StringUtils.isBlankOrNull(line.replaceAll(";", "")))
				continue;
			
			if (firstLine > lineCount)
			{
				lineCount++;
				continue;
			}
			
			if (!line.startsWith(IGNORE_LINE_CODE))
				list.add(parse(line, clazz, fields, varArgField, varArgFields));
			
			lineCount++;
		}
		
		return list;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> T parse(String line, Class<T> clazz, List<Field> fields, Field varArgField, List<Field> varArgFields) throws ManageGSPException
	{
		int i = 0;
		List varArgList = null;
		
		try
		{
			T obj = clazz.getConstructor().newInstance();
			
			varArgList = getOrCreateVarArgList(obj, varArgField);
			
			String[] values = line.split(CSV_DIVISOR_COLUMN);
			
			for (i = 0; i < values.length && i < fields.size(); i++)
			{
				String value = values[i].toString().trim();
				
				if (!"".equals(value))
					fields.get(i).set(obj, value);
			}
			
			if (varArgField != null)
			{
				while (i < values.length)
				{
					Object objVarArg = instanceFirstGeneric(varArgField);
					
					int j = i + varArgFields.size();
					
					boolean hasAnyValue = false;
					
					for (int z = 0; i < values.length && i < j; i++, z++)
					{
						String value = values[i].toString().trim();
						
						if (!"".equals(value))
						{
							varArgFields.get(z).set(objVarArg, value);
							
							hasAnyValue = true;
						}
					}
					
					if (hasAnyValue)
						varArgList.add(objVarArg);
				}
			}
			
			return obj;
		}
		catch (InstantiationException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (IllegalAccessException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (IllegalArgumentException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (InvocationTargetException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (NoSuchMethodException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
		catch (SecurityException e)
		{
			throw new ManageGSPException(e.getMessage(), e);
		}
	}
	
	private static Object instanceFirstGeneric(Field field) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException
	{
        Type type = field.getGenericType();

        if (type instanceof ParameterizedType)
        {
            ParameterizedType pType = (ParameterizedType)type;
            
            Type[] arr = pType.getActualTypeArguments();

            if (arr != null && arr.length > 0)
            {
                return ((Class<?>) arr[0]).getConstructor().newInstance();
            }
        }
        
        return null;
	}
	
	@SuppressWarnings("rawtypes")
	private static Class getFirstGenericClass(Field field)
	{
        Type type = field.getGenericType();

        if (type instanceof ParameterizedType)
        {
            ParameterizedType pType = (ParameterizedType)type;
            
            Type[] arr = pType.getActualTypeArguments();

            if (arr != null && arr.length > 0)
            {
                return  (Class) arr[0];
            }
        }
        
        return null;
	}
	
	@SuppressWarnings("rawtypes")
	private static List getOrCreateVarArgList(Object obj, Field varArgField) throws IllegalArgumentException, IllegalAccessException
	{
		if (varArgField != null)
		{
			List varArgColection = (List<?>) varArgField.get(obj);
			
			if (varArgColection == null)
			{
				varArgColection = new ArrayList<Object>();
				varArgField.set(obj, varArgColection);
			}
			
			return varArgColection;
		}
		
		return null;
	}
	
	public static List<Field> getValidsFieldsToImport(Field[] fields)
	{
		List<Field> fieldsList = new ArrayList<Field>();
		
		for (Field f : fields)
		{
			ColumnCSV c = f.getAnnotation(ColumnCSV.class);
			
			if (c != null && c.importable())
			{
				f.setAccessible(true);
				
				fieldsList.add(f);
			}
		}
		
		return fieldsList;
	}
	
	public static Field getVarArgField(Field[] fields)
	{
		Field f = fields[fields.length - 1];
		
		f.setAccessible(true);
		
		VarArgCSV v = f.getAnnotation(VarArgCSV.class);
		
		if (v == null)
			return null;
		
		return f;
	}
}