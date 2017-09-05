package br.com.qualicorp.redenarede.service.administracaoestipulante.to;

import br.com.qualicorp.redenarede.commons.csv.ColumnCSV;

public class EstipulanteImporterCSV
{
	@ColumnCSV(label = "Codigo Carteirinha")
	private String codigoCarteirinha;
	
	@ColumnCSV(label = "Codigo Estipulante")
	private String codigoEstipulante;
	
	@ColumnCSV(label = "Codigo Subestipulante")
	private String codigoSubestipulante;
	
	@ColumnCSV(label = "Erros")
	private String erros;

	private int errosCount = 0;
	
	public String toStringLitle()
	{
		return "EstipulanteImporterCSV [codigoCarteirinha=" + codigoCarteirinha + ", codigoEstipulante=" + codigoEstipulante + ", codigoSubestipulante=" + codigoSubestipulante
				+ "]";
	}
	
	public String getErros()
	{
		return erros;
	}

	public void setErros(String erros)
	{
		this.erros = erros;
	}

	public String getCodigoCarteirinha() {
		return codigoCarteirinha;
	}

	public void setCodigoCarteirinha(String codigoCarteirinha) {
		this.codigoCarteirinha = codigoCarteirinha;
	}

	public String getCodigoEstipulante() {
		return codigoEstipulante;
	}

	public void setCodigoEstipulante(String codigoEstipulante) {
		this.codigoEstipulante = codigoEstipulante;
	}

	public String getCodigoSubestipulante() {
		return codigoSubestipulante;
	}

	public void setCodigoSubestipulante(String codigoSubestipulante) {
		this.codigoSubestipulante = codigoSubestipulante;
	}
	
	public void appendError(String error)
	{
		if (erros == null)
			erros = "Erros: ";
		
		erros += ++errosCount + "- " + error + " ";
	}
}