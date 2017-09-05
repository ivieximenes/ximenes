package br.com.qualicorp.redenarede.commons.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import lumis.portal.UnexpectedException;

public class DateUtils
{
	private static final Locale localePT = new Locale("pt", "BR");
	private static final Locale localeEN = new Locale("en", "US");
	
	private static final SimpleDateFormat FORMATER_PT = new SimpleDateFormat("dd/MM/yyyy", localePT);
	private static final SimpleDateFormat FORMATER_TIME = new SimpleDateFormat("HH:mm:ss", localePT);
	private static final SimpleDateFormat FORMATER_EN = new SimpleDateFormat("MM/dd/yyyy", localeEN);
	
	private static final SimpleDateFormat FORMATER_TIME_EN = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss", localeEN);
	private static final SimpleDateFormat FORMATER_TIME_PT = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", localePT);
	
	private static final SimpleDateFormat FORMATER_MY_PT = new SimpleDateFormat("MMM/yyyy", localePT);
	private static final SimpleDateFormat FORMATER_MY_EN = new SimpleDateFormat("MMM/yyyy", localeEN);
	
	private static final SimpleDateFormat MONTH_FORMATER_PT = new SimpleDateFormat("MMMM", localePT);
	private static final SimpleDateFormat YEAR_FORMATER_PT = new SimpleDateFormat("yyyy", localePT);
	private static final SimpleDateFormat DAY_FORMATER_PT = new SimpleDateFormat("dd", localePT);
	
	private static final SimpleDateFormat FORMATER_GAMA = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", localePT);
	private static final SimpleDateFormat FORMATER_GAMA_NO_TIME = new SimpleDateFormat("yyyy-MM-dd", localePT);
	
	public static Date getCurrentDateNoTime()
	{
		Calendar calendar = Calendar.getInstance();
		
		calendar.setTime(new Date());
		
	    calendar.set(Calendar.HOUR_OF_DAY, 0);
	    calendar.set(Calendar.MINUTE, 0);
	    calendar.set(Calendar.SECOND, 0);
	    calendar.set(Calendar.MILLISECOND, 0);
	    
	    return calendar.getTime();
	}
	
	public static int diffDays(Date startDate, Date endDate)
	{
		return (int) - ( (startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24) );
	}
	
	public static int diffMonths(Date startDate, Date endDate)
	{
		Calendar sDate = Calendar.getInstance();
		Calendar eDate = Calendar.getInstance();
		
		sDate.setTime(startDate);
		eDate.setTime(endDate);
		
		int diffYear = eDate.get(Calendar.YEAR) - sDate.get(Calendar.YEAR);
		int diffMonths = diffYear * 12 + eDate.get(Calendar.MONTH) - sDate.get(Calendar.MONTH);
		
		if (diffMonths < 0)
			diffMonths = diffMonths * -1;
		
		return diffMonths;
	}
	
	public static String formatNoTime(Date date, Locale locale)
	{
		if (locale.equals(localeEN))
		{
			return formatNoTimeEN(date);
		}
		
		return formatNoTimePT(date);
	}
	
	public static String formatNoTimePT(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_PT.format(date);
	}
	
	public static String formatNoTimeEN(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_EN.format(date);
	}
	
	public static String formatTimeEN(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_TIME_EN.format(date);
	}
	
	public static String formatTimePT(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_TIME_PT.format(date);
	}
	
	public static String formatNoDatePT(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_TIME.format(date);
	}
	
	public static Date parse(String date) throws UnexpectedException
	{
		if (StringUtils.isBlankOrNull(date))
			return null;
		
		try
		{
			return FORMATER_PT.parse(date);
		}
		catch (ParseException e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public static String formatMMMyyyy(Date date)
	{
		return formatMMMyyyy(date, null);
	}
	
	public static String formatMMMyyyy(Date date, Locale locale)
	{
		if (locale == null || locale.toString().equals(localePT.toString()))
		{
			return FORMATER_MY_PT.format(date);
		}
		
		return FORMATER_MY_EN.format(date);
	}

	public static String formatGama(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_GAMA.format(date);
	}

	public static String formatGamaNoTime(Date date)
	{
		if (date == null)
			return null;
		
		return FORMATER_GAMA_NO_TIME.format(date);
	}
	
	public static long getDiffDaysIgnoreTime(Date before, Date after)
	{
		return (getDateNoTime(after).getTime() - getDateNoTime(before).getTime())/1000/60/60/24; 
	}
	
	public static int getDiffYears(Date first, Date last)
	{
	    Calendar a = Calendar.getInstance();
	    a.setTime(first);
	    
	    Calendar b = Calendar.getInstance();
	    b.setTime(last);
	    
		int age = b.get(Calendar.YEAR) - a.get(Calendar.YEAR);

		int month1 = b.get(Calendar.MONTH);
		int month2 = a.get(Calendar.MONTH);

		if (month2 > month1)
		{
			age--;
		}
		else if (month1 == month2)
		{
			int day1 = b.get(Calendar.DAY_OF_MONTH);
			int day2 = a.get(Calendar.DAY_OF_MONTH);
			
			if (day2 > day1)
			{
				age--;
			}
		}
	    
	    return age;
	}
	
	public static Date getDateNoTime(Date date)
	{
		Calendar c = Calendar.getInstance();
		
		c.setTime(date);

		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		
		return  c.getTime();
	}
	
	public static String getMonthWord(Date date)
	{
		if (date == null)
		{
			return null;
		}
		
		return MONTH_FORMATER_PT.format(date);
	}
	
	public static String getYear(Date date)
	{
		if (date == null)
		{
			return null;
		}
		
		return YEAR_FORMATER_PT.format(date);
	}

	public static String getDia(Date date)
	{
		if (date == null)
		{
			return null;
		}
		
		return DAY_FORMATER_PT.format(date);
	}
}