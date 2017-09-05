
package br.com.qualicorp.redenarede.webservice.stub.beneficiario;

import java.net.MalformedURLException;
import java.net.URL;

import javax.jws.HandlerChain;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.1-b03-
 * Generated source version: 2.1
 * 
 */
@WebServiceClient(name = "AutenticacaoBeneficiarioService", targetNamespace = "http://service.autenticacao.ws.tempoassist.com.br", wsdlLocation = "https://wwwt.connectmed.com.br/saudewebHomologacao/autenticacaoWSContainer/services/AutenticacaoBeneficiarioService?wsdl")
@HandlerChain(file = "handler-chain-beneficiario.xml")
public class AutenticacaoBeneficiarioService_Service
    extends Service
{

    private final static URL AUTENTICACAOBENEFICIARIOSERVICE_WSDL_LOCATION;

    static {
        URL url = null;
        try {
            url = new URL("https://wwwt.connectmed.com.br/saudewebHomologacao/autenticacaoWSContainer/services/AutenticacaoBeneficiarioService?wsdl");
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        AUTENTICACAOBENEFICIARIOSERVICE_WSDL_LOCATION = url;
    }

    public AutenticacaoBeneficiarioService_Service(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public AutenticacaoBeneficiarioService_Service() {
        super(AUTENTICACAOBENEFICIARIOSERVICE_WSDL_LOCATION, new QName("http://service.autenticacao.ws.tempoassist.com.br", "AutenticacaoBeneficiarioService"));
    }

    /**
     * 
     * @return
     *     returns AutenticacaoBeneficiarioServicePortType
     */
    @WebEndpoint(name = "AutenticacaoBeneficiarioServiceHttpSoapEndpoint")
    public AutenticacaoBeneficiarioServicePortType getAutenticacaoBeneficiarioServiceHttpSoapEndpoint() {
        return (AutenticacaoBeneficiarioServicePortType)super.getPort(new QName("http://service.autenticacao.ws.tempoassist.com.br", "AutenticacaoBeneficiarioServiceHttpSoapEndpoint"), AutenticacaoBeneficiarioServicePortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns AutenticacaoBeneficiarioServicePortType
     */
    @WebEndpoint(name = "AutenticacaoBeneficiarioServiceHttpSoapEndpoint")
    public AutenticacaoBeneficiarioServicePortType getAutenticacaoBeneficiarioServiceHttpSoapEndpoint(WebServiceFeature... features) {
        return (AutenticacaoBeneficiarioServicePortType)super.getPort(new QName("http://service.autenticacao.ws.tempoassist.com.br", "AutenticacaoBeneficiarioServiceHttpSoapEndpoint"), AutenticacaoBeneficiarioServicePortType.class, features);
    }

}
