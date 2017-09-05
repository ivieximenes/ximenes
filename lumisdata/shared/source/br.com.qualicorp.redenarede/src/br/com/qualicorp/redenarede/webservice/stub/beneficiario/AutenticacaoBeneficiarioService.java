
package br.com.qualicorp.redenarede.webservice.stub.beneficiario;

import javax.xml.ws.WebFault;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.1-b03-
 * Generated source version: 2.1
 * 
 */
@WebFault(name = "AutenticacaoBeneficiarioService", targetNamespace = "http://service.autenticacao.ws.tempoassist.com.br")
public class AutenticacaoBeneficiarioService
    extends Exception
{

	private static final long serialVersionUID = 1L;
	
    private String faultInfo;

    /**
     * 
     * @param faultInfo
     * @param message
     */
    public AutenticacaoBeneficiarioService(String message, String faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @param faultInfo
     * @param cause
     * @param message
     */
    public AutenticacaoBeneficiarioService(String message, String faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @return
     *     returns fault bean: java.lang.String
     */
    public String getFaultInfo() {
        return faultInfo;
    }

}