package br.com.qualicorp.redenarede.service.administracaoestipulante.to;

import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;

public class EstipulanteTO
{
	String idestipulante;
	String nome;
	String codigo;
	String subestipulante;
	
	public String getGroupAlias()
	{
		return EstipulanteManager.getInstance().makeAliasGroup(codigo, subestipulante);
	}
	
	public String getIdestipulante()
	{
		return idestipulante;
	}
	public void setIdestipulante(String idestipulante)
	{
		this.idestipulante = idestipulante;
	}
	public String getNome()
	{
		return nome;
	}
	public void setNome(String nome)
	{
		this.nome = nome;
	}
	public String getCodigo()
	{
		return codigo;
	}
	public void setCodigo(String codigo)
	{
		this.codigo = codigo;
	}
	public String getSubestipulante()
	{
		return subestipulante;
	}
	public void setSubestipulante(String subestipulante)
	{
		this.subestipulante = subestipulante;
	}
}