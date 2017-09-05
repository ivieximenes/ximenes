package br.com.qualicorp.redenarede.service.useraccount.to;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Empresa;

@XmlAccessorType(XmlAccessType.FIELD)
public class BeneficionarioTO
{
	private String id;
	private String nome;
	private String cpf;
	private String rg;
	private String orgaoEmissor;
	private String nomeMae;
	private String email;
	private String numeroCarteira;
	private String dataNascimento;
	private Date dataNascimentoDate;
	private String telefone;
	private boolean shouldUpdateTelefone; //Essa variável existe porque às vezes o telefone é cadastrado erroneamente na gama, e neste caso, deve-se deixar o seu valor null no Portal GSP
	private String codigoEstipulante;
	private String codigoSubEstipulante;
	private String plano;
	private String userId;
	private String codigoInternoGama;
	private String password;
	private Date dataAlteracao;
	private List<Beneficiario> grupoFamiliar;
	private Empresa empresa;
	
	public String getGroupEstipulanteAlias()
	{
		return EstipulanteManager.getInstance().makeAliasGroup(codigoEstipulante, codigoSubEstipulante);
	}
	
	public String getCodigoEstipulante()
	{
		return codigoEstipulante;
	}
	public void setCodigoEstipulante(String codigoEstipulante)
	{
		this.codigoEstipulante = codigoEstipulante;
	}
	public String getNome()
	{
		return nome;
	}
	public void setNome(String nome)
	{
		this.nome = nome;
	}
	public String getCpf()
	{
		return cpf;
	}
	public String getCpfNoFormat()
	{
		if (cpf == null)
			return null;
		
		return cpf.replaceAll("\\D", "");
	}
	public void setCpf(String cpf)
	{
		this.cpf = cpf;
	}
	public String getRg()
	{
		return rg;
	}
	public void setRg(String rg)
	{
		this.rg = rg;
	}
	public String getOrgaoEmissor()
	{
		return orgaoEmissor;
	}
	public void setOrgaoEmissor(String orgaoEmissor)
	{
		this.orgaoEmissor = orgaoEmissor;
	}
	public String getNomeMae()
	{
		return nomeMae;
	}
	public void setNomeMae(String nomeMae)
	{
		this.nomeMae = nomeMae;
	}
	public String getEmail()
	{
		return email;
	}
	public void setEmail(String email)
	{
		this.email = email;
	}
	public String getNumeroCarteira()
	{
		return numeroCarteira;
	}
	public void setNumeroCarteira(String numeroCarteira)
	{
		this.numeroCarteira = numeroCarteira;
	}
	public String getDataNascimento()
	{
		return dataNascimento;
	}
	public void setDataNascimento(String dataNascimento)
	{
		this.dataNascimento = dataNascimento;
	}
	public String getTelefone()
	{
		return telefone;
	}
	public String getTelefoneFormated()
	{
		return StringUtils.formatPhone(telefone);
	}
	public String getTelefoneOnlyNumbers()
	{
		if (telefone == null)
			return null;
		
		return telefone.replaceAll("\\D", "");
	}
	public void setTelefone(String telefone)
	{
		this.telefone = telefone;
	}
	public Date getDataNascimentoDate()
	{
		return dataNascimentoDate;
	}
	public void setDataNascimentoDate(Date dataNascimentoDate)
	{
		this.dataNascimentoDate = dataNascimentoDate;
	}
	public String getUserId()
	{
		return userId;
	}
	public void setUserId(String userId)
	{
		this.userId = userId;
	}
	public String getPlano()
	{
		return plano;
	}
	public void setPlano(String plano)
	{
		this.plano = plano;
	}
	public String getCodigoSubEstipulante()
	{
		return codigoSubEstipulante;
	}
	public void setCodigoSubEstipulante(String codigoSubEstipulante)
	{
		this.codigoSubEstipulante = codigoSubEstipulante;
	}

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public String getCodigoInternoGama()
	{
		return codigoInternoGama;
	}

	public void setCodigoInternoGama(String codigoInternoGama)
	{
		this.codigoInternoGama = codigoInternoGama;
	}

	public String getPassword()
	{
		return password;
	}

	public void setPassword(String password)
	{
		this.password = password;
	}

	public Date getDataAlteracao()
	{
		return dataAlteracao;
	}

	public void setDataAlteracao(Date dataAlteracao)
	{
		this.dataAlteracao = dataAlteracao;
	}

	public boolean isShouldUpdateTelefone()
	{
		return shouldUpdateTelefone;
	}

	public void setShouldUpdateTelefone(boolean shouldUpdateTelefone)
	{
		this.shouldUpdateTelefone = shouldUpdateTelefone;
	}

	public List<Beneficiario> getGrupoFamiliar() {
		return grupoFamiliar;
	}

	public void setGrupoFamiliar(List<Beneficiario> grupoFamiliar) {
		this.grupoFamiliar = grupoFamiliar;
	}

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}
}
