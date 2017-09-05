
package br.com.qualicorp.redenarede.webservice.stub.pretador;

import javax.jws.HandlerChain;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for RetornoUsuarioPrestador complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="RetornoUsuarioPrestador">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Mensagem" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Sucesso" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="Token" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "RetornoUsuarioPrestador", namespace = "http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador", propOrder = {
    "mensagem",
    "sucesso",
    "token"
})
@HandlerChain(file = "handler-chain-prestador.xml")
public class RetornoUsuarioPrestador {

    @XmlElement(name = "Mensagem", namespace = "http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador", nillable = true)
    protected String mensagem;
    @XmlElement(name = "Sucesso", namespace = "http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador")
    protected Boolean sucesso;
    @XmlElement(name = "Token", namespace = "http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador", nillable = true)
    protected String token;

    /**
     * Gets the value of the mensagem property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMensagem() {
        return mensagem;
    }

    /**
     * Sets the value of the mensagem property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMensagem(String value) {
        this.mensagem = value;
    }

    /**
     * Gets the value of the sucesso property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isSucesso() {
        return sucesso;
    }

    /**
     * Sets the value of the sucesso property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setSucesso(Boolean value) {
        this.sucesso = value;
    }

    /**
     * Gets the value of the token property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets the value of the token property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setToken(String value) {
        this.token = value;
    }

}
