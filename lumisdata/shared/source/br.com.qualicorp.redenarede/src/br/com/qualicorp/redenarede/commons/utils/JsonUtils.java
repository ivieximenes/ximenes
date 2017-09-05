package br.com.qualicorp.redenarede.commons.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class JsonUtils
{
	private static final Gson GSON = new GsonBuilder().serializeNulls().setDateFormat("dd-MM-yyyy HH:mm:ss").create();
	
	public static String parse(Object bean)
	{
		return GSON.toJson(bean);
	}

	public static <T> T getBean(String json, Class<T> type)
	{
		return GSON.fromJson(json, type);
	}
	
	public static JsonObject getJsonObject(String json )
	{
		return GSON.fromJson(json, JsonElement.class).getAsJsonObject();
	}
}