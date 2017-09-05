
package br.com.qualicorp.redenarede.webservice.stub.beneficiario;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServiceResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ServiceResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="resultado" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="codigoErro" type="{http://ws.common.tempoassist.com.br/schema}TipoErro" minOccurs="0"/>
 *         &lt;element name="mensagem" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ServiceResponse", namespace = "http://ws.common.tempoassist.com.br/schema", propOrder = {
    "resultado",
    "codigoErro",
    "mensagem"
})
@XmlSeeAlso({
    TrocarSenhaResponse.class,
    CriarSenhaResponse.class,
    CriarSenhaGspResponse.class,
    AutenticarResponse.class,
    ConsultarTokenResponse.class,
    RecuperarSenhaResponse.class
})
public class ServiceResponse {

    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Boolean resultado;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Integer codigoErro;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String mensagem;

    /**
     * Gets the value of the resultado property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isResultado() {
        return resultado;
    }

    /**
     * Sets the value of the resultado property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setResultado(Boolean value) {
        this.resultado = value;
    }

    /**
     * Gets the value of the codigoErro property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getCodigoErro() {
        return codigoErro;
    }

    /**
     * Sets the value of the codigoErro property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setCodigoErro(Integer value) {
        this.codigoErro = value;
    }

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

}
