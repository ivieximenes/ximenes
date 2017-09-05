package br.com.qualicorp.redenarede.service.autodeploy.clock;

import java.io.IOException;

import lumis.portal.authentication.SessionConfig;
import lumis.portal.clock.ClockConfig;
import lumis.portal.service.GenericServiceClock;
import lumis.portal.service.ServiceException;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.ITransaction;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class AutoDeployClock extends GenericServiceClock{

	@Override
	public void doTick(SessionConfig sessionConfig, ClockConfig clockConfig) throws ServiceException {
		// TODO Auto-generated method stub
		
		
		 ILogger logger = LoggerFactory.getServiceLogger("arquivamentoNoticias");
	       
	       // Cria uma nova transação
	       ITransaction transaction = PortalTransactionFactory.createTransaction();
	       
	       try
	       {
	             // Inicializa a transação
//	             transaction.begin();
	             
	             // Registra o resultado da execução do clock no log
	             logger.info("\n OK. conteúdos arquivados.\n");
	             Process process = Runtime.getRuntime().exec("cmd /c start C:/lumis/teste.bat");
	             System.out.println("EXECUTANDO O CLOCKK DO LUMISSS 888");
	             // Faz o commit da transação após o arquivamento dos conteúdos
//	             transaction.commit();
	       } 
	       catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	       finally
	       {
	             // Garante a finalização da transação criada
	             transaction.close();
	       }
	}

}
