package br.com.qualicorp.redenarede.service.useraccount.manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import br.com.qualicorp.redenarede.commons.utils.DateUtils;
import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticacaoBeneficiario;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.ITransaction;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class UserAccountManager
{
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	
	private static UserAccountManager manager;
	
	private UserAccountManager()
	{
		
	}
	
	public static UserAccountManager getInstance()
	{
		if (manager == null)
			manager = new UserAccountManager();
		
		return manager;
	}
	
	public boolean prestadorExistente(String cpf_cnpj, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			boolean existeUsuario = false;
			
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();

			PreparedStatement statement = connection.prepareStatement(" select * from QC_PRESTADOR where cpf_cnpj = ? ");
			try
			{
				statement.setString(1, cpf_cnpj);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						existeUsuario = true;
						
					}
				}
				finally
				{
					resultSet.close();
				}
			}
			finally
			{
				statement.close();
			}
			
			return existeUsuario;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public String getUserIdPrestadorByCpfCnpj(String cpf_cnpj, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();

			PreparedStatement statement = connection.prepareStatement(" select user_id from QC_PRESTADOR where cpf_cnpj = ? ");
			try
			{
				statement.setString(1, cpf_cnpj);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						return resultSet.getString("user_id");
						
					}
				}
				finally
				{
					resultSet.close();
				}
			}
			finally
			{
				statement.close();
			}
			
			return null;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public AutenticacaoBeneficiario getAutenticacaoBeneficiario(String cpf, String login) throws PortalException
	{
		ITransactionJdbc transaction = null;

		AutenticacaoBeneficiario beneficiario = new AutenticacaoBeneficiario();

		try
		{
			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			BeneficionarioTO to = null;
			
			if (!StringUtils.isBlankOrNull(login))
			{
				to = BeneficiarioManager.getInstance().getByNumeroCarteira(login, transaction);
				
				if (!StringUtils.isBlankOrNull(cpf) )
				{
					if (DateUtils.getDiffYears(to.getDataNascimentoDate(), new Date()) > 17)
					{
						if (!cpf.replaceAll("\\D", "").equals(to.getCpfNoFormat())) // Se cpf diferente do que foi cadastrado, invalida!
						{
							to = null;
						}
					}
					else
					{
						to.setCpf(cpf); //Para menores de idade, deixe a Gama validar o cpf, pois, não o guardamos na nossa base!
					}

				}
			}
			else if (!StringUtils.isBlankOrNull(cpf))
			{
				List<BeneficionarioTO> tos = BeneficiarioManager.getInstance().getBeneficiariosByCPF(cpf, transaction);
				
				if (tos != null && !tos.isEmpty())
					to = tos.get(0);
			}
			
			if (to != null)
			{
				beneficiario.setUsuario(to.getNumeroCarteira());
				SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
				beneficiario.setDataNascimento(stringToXMLGregorianCalendar(dateFormatter.format(to.getDataNascimentoDate())));
				beneficiario.setCpf(to.getCpf());
			}
		}
		catch (Exception e)
		{
			logger.error("Error", e);
			throw new PortalException(e.getMessage(), e);
		}
		finally
		{
			transaction.close();
		}

		return beneficiario;
	}
	
	public void setUserMultsessao(String userID, ITransaction transaction) throws UnexpectedException 
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{
			connection = daoTransactionJdbc.getConnection();

			statement = connection.prepareStatement(" UPDATE LUM_USER SET MULTISESSION = 1 WHERE USERID = ?");
			
			statement.setString(1, userID);
			statement.executeUpdate();
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.close(null, statement);
			}
			catch (SQLException e)
			{
				logger.error("Error ao fechar os recursos JDBC!", e);
				throw new UnexpectedException(e);
			}
		}
	}
	
	/**
	 * Este método foi criado apenas para uma solução rápida de preenchimento de tabela.
	 * No futuro será adaptado para rodar scripts em arquivos .sql
	 * @param transaction
	 * @return
	 */
	public String executaScript(ITransaction transaction){
		String logScript = "";
		
		String[] script = { "insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D01F333F557E', '2C96A66853B531AE0154D01F333F557E', '130090000064015', '424.265.898-25', ' ', ' ', 'LILIAM BEATRIZ SANTOS BARROS', '12/11/2015')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D3D9D8885C73', '2C96A66853B531AE0154D3D9D8885C73', '130090000099013', '296.780.748-69', ' ', ' ', 'JOCILENE TELES MANZONETTO', '22/12/2007')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D0C146F3575C', '2C96A66853B531AE0154D0C146F3575C', '130090000241006', '282.473.768-90', ' ', ' ', 'MARA DEISE RODRIGUES DE MORAIS', '20/11/1978')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C003189C36EA', '2C96A66853B531AE0154C003189C36EA', '130090000550017', '229.737.978-10', ' ', ' ', 'BRUNA MAIRA NUNES BENTO RODRIGUES', '24/12/2013')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C5734C0B1ADC', '2C96A66853B531AE0154C5734C0B1ADC', '130090000566002', '316.750.728-41', ' ', ' ', 'MARIA LUCIA TEIXEIRA DOS SANTOS', '15/07/1984')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D85698F933A2', '2C96A66853B531AE0154D85698F933A2', '130090000796016', '388.178.018-10', ' ', ' ', 'VIRGINIA MARIA BEZERRA DE OLIVEIRA', '23/06/1992')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BA74A21668F9', '2C96A66853B531AE0154BA74A21668F9', '130090000805007', '054.478.748-07', ' ', ' ', 'MARIA ISA PAULA DOS SANTOS', '16/11/1961')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DE7F54D3365C', '2C96A66853B531AE0154DE7F54D3365C', '130090000856000', '345.428.018-45', ' ', ' ', 'ZILDA DA SILVA CUNHA', '13/06/1986')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154CC042F361EB2', '2C96A66853B531AE0154CC042F361EB2', '130090000906008', '301.127.288-39', ' ', ' ', 'FRANCISCA FERREIRA NERI DE SOUSA', '23/06/1982')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C9AEE7AC1BF2', '2C96A66853B531AE0154C9AEE7AC1BF2', '130090001144004', '436.554.278-83', ' ', ' ', 'JOSENILDA FERNANDES DE MAGALHAES OLIVEIRA', '29/09/1996')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C44185A11A3D', '2C96A66853B531AE0154C44185A11A3D', '130090001299008', '116.844.158-70', ' ', ' ', 'MARIA WANILDE SILVA ROCHA', '01/07/1975')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BFAC2409261A', '2C96A66853B531AE0154BFAC2409261A', '130090001301010', '376.829.128-63', ' ', ' ', 'APARECIDA MACHADO SARRI', '22/11/1990')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C0860BE0696A', '2C96A66853B531AE0154C0860BE0696A', '130090001341020', '016.909.785-46', ' ', ' ', 'ADRIANA CRUZ DE SOUZA', '11/09/1998')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BFEB719B3119', '2C96A66853B531AE0154BFEB719B3119', '130090001409008', '321.960.228-29', ' ', ' ', 'MARIA DE FATIMA BARTULITTI', '09/09/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BFEEBA7A3153', '2C96A66853B531AE0154BFEEBA7A3153', '130090001409016', '220.780.778-95', ' ', ' ', 'MARIA DALVA CARVALHO', '28/01/1981')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C974DC2D179C', '2C96A66853B531AE0154C974DC2D179C', '130090001431003', '339.302.438-81', ' ', ' ', 'MARIA DOS PRAZERES CARNEIRO DE ANDRADE DEL RIO', '13/06/1986')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DE7E2EDB3207', '2C96A66853B531AE0154DE7E2EDB3207', '130090001457002', '385.820.608-31', ' ', ' ', 'CLAUDINEZ DE OLIVEIRA PIAUI SOUZA', '06/12/1990')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BB0CED79007D', '2C96A66853B531AE0154BB0CED79007D', '130090001503020', '452.802.008-40', ' ', ' ', 'VIVIANE SILVA', '11/06/1996')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C45B59686124', '2C96A66853B531AE0154C45B59686124', '130090001663001', '305.266.078-07', ' ', ' ', 'MARIA VANDERLEIA VIEIRA DOS SANTOS', '01/05/1982')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DF2D1A4B57A3', '2C96A66853B531AE0154DF2D1A4B57A3', '130090001675018', '331.355.808-90', ' ', ' ', 'MARIA DO SOCORRO CEZARIO DE OLIVEIRA', '08/05/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C4D309AA5C48', '2C96A66853B531AE0154C4D309AA5C48', '130090001743005', '223.444.408-01', ' ', ' ', 'NOELIR VERA CRUZ SILVESTRE', '08/07/1982')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C9E6C643646D', '2C96A66853B531AE0154C9E6C643646D', '130090001840000', '325.322.318-31', ' ', ' ', 'CLAUDELUCIA APRIGIO DE SOUSA', '22/12/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C4379A1E77A3', '2C96A66853B531AE0154C4379A1E77A3', '130090001878008', '306.887.568-40', ' ', ' ', 'EDNA KERSUL LEITE DE SOUZA', '03/09/1979')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C437BE10782E', '2C96A66853B531AE0154C437BE10782E', '130090001881017', '173.706.698-07', ' ', ' ', 'NEUZA DE GODOY MARINI', '26/09/1970')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DDC8C9CD5100', '2C96A66853B531AE0154DDC8C9CD5100', '130090001886000', '330.064.848-35', ' ', ' ', 'EDNEIA MENDES CAETANO', '20/08/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DDD9FBB85227', '2C96A66853B531AE0154DDD9FBB85227', '130090001887007', '356.398.098-50', ' ', ' ', 'GISLEIDE DIAS LINOS DOS SANTOS', '13/05/1986')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154CF4402CB4CFE', '2C96A66853B531AE0154CF4402CB4CFE', '130090001891004', '345.277.758-80', ' ', ' ', 'ADELINA FERREIRA DE SOUZA BLUME', '21/12/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BB941F995DBC', '2C96A66853B531AE0154BB941F995DBC', '130090001906028', '442.484.778-07', ' ', ' ', 'KATIA VOLPI TAKATA', '01/04/1994')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C41C579F10C6', '2C96A66853B531AE0154C41C579F10C6', '130090001960006', '386.528.778-66', ' ', ' ', 'MIRIAM ALAIDE DA SILVA', '06/02/1992')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154B9E76F8E7FCD', '2C96A66853B531AE0154B9E76F8E7FCD', '130090002023022', '852.605.841-04', ' ', ' ', 'GRAZIELLE BARBOZA', '27/05/2011')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C431332A5FDB', '2C96A66853B531AE0154C431332A5FDB', '130090002070004', '369.983.638-00', ' ', ' ', 'VALDETE CARDOZO E SILVA', '20/01/1989')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C564F2086182', '2C96A66853B531AE0154C564F2086182', '130090002072015', '258.210.458-27', ' ', ' ', 'DIVINA ROSSI DE ANDRADE', '26/04/1978')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C8E08EBF5980', '2C96A66853B531AE0154C8E08EBF5980', '130090002307020', '378.191.228-03', ' ', ' ', 'CRISTIANA REIS', '06/04/1988')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154CA45F1556739', '2C96A66853B531AE0154CA45F1556739', '130090002357001', '395.262.608-21', ' ', ' ', 'NEUZA MARIA CONCEICAO', '20/01/1991')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154CB60FC011C4A', '2C96A66853B531AE0154CB60FC011C4A', '130090002377002', '057.485.535-11', ' ', ' ', 'EDINELIA CAMPOS RIBEIRO', '06/01/1993')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154CB657D2D1C5D', '2C96A66853B531AE0154CB657D2D1C5D', '130090002377010', '070.423.546-30', ' ', ' ', 'VERA LUCIA GONCALVES JARDIM DOS SANTOS', '06/01/1993')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BA0DA26101A9', '2C96A66853B531AE0154BA0DA26101A9', '130090002383002', '013.154.016-57', ' ', ' ', 'ELENICE CARVALHO PINTO', '24/08/1983')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DE84E03B36A3', '2C96A66853B531AE0154DE84E03B36A3', '130090002391005', '362.269.158-11', ' ', ' ', 'SEMIRAMIS SANCHES FERREIRA CARVALHO', '10/12/1988')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154B9E040627F6E', '2C96A66853B531AE0154B9E040627F6E', '130090002473028', '327.911.458-69', ' ', ' ', 'MARIA CRISTINA MOTA', '10/02/1984')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BF5B493B6E7F', '2C96A66853B531AE0154BF5B493B6E7F', '130090002477007', '308.751.348-23', ' ', ' ', 'NEIDE ROSA DOS SANTOS SILVA', '16/08/1982')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D3AC0E2D5BAB', '2C96A66853B531AE0154D3AC0E2D5BAB', '130090002486006', '354.482.428-04', ' ', ' ', 'IVANILDE DE OLIVEIRA SILVA CASTRO', '19/02/1985')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154D3AECF715BB1', '2C96A66853B531AE0154D3AECF715BB1', '130090002486014', '320.891.998-06', ' ', ' ', 'ANA MARIA NOGUEIRA', '04/04/1988')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154DD71757C3C10', '2C96A66853B531AE0154DD71757C3C10', '130090002487002', '334.146.068-36', ' ', ' ', 'IVONETE ALVES DA CRUZ SILVA', '04/02/1986')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154C5059B2E1F4A', '2C96A66853B531AE0154C5059B2E1F4A', '130090002494009', '216.930.228-00', ' ', ' ', 'JANDIRA DIMAS PEREIRA', '08/02/1981')",
							"insert into qc_beneficiario (ID, USER_ID, NUMERO_CARTEIRA, CPF, RG, ORGAO_EMISSOR, NOME_MAE, DATA_NASCIMENTO) values ('2C96A66853B531AE0154BF930E880E04', '2C96A66853B531AE0154BF930E880E04', '130090002510004', '373.778.628-31', ' ', ' ', 'MARIA APARECIDA CARBONELLI LUIZ', '06/12/1989')"};
		
		try
		{
			
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();
			for(int i=0; i<script.length;i++){
				logger.info((i+1)+"-->Inserindo o beneficiário: "+script[i].split(",")[13]);
				PreparedStatement statement = connection.prepareStatement(script[i]);
				try
				{
					statement.execute();
					logger.info("-->Sucesso Inserindo o beneficiário: "+script[i].split(",")[13]);
				}
				finally
				{
					statement.close();
				}
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		
		return logScript;
	}
	
	private XMLGregorianCalendar stringToXMLGregorianCalendar(String strDate)
	{
		XMLGregorianCalendar result = null;
		Date date;
		SimpleDateFormat simpleDateFormat;
		GregorianCalendar gregorianCalendar;

		try
		{
			simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
			date = simpleDateFormat.parse(strDate);
			gregorianCalendar = (GregorianCalendar) GregorianCalendar.getInstance();
			gregorianCalendar.setTime(date);
			result = DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
		}
		catch (Exception e)
		{
			logger.error("Error!", e);
			e.printStackTrace();
		}
		
		return result;
	}
}
