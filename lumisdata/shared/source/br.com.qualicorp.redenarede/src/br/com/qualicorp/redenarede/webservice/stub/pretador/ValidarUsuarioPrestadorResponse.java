
package br.com.qualicorp.redenarede.webservice.stub.pretador;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ValidarUsuarioPrestadorResult" type="{http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador}RetornoUsuarioPrestador" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "validarUsuarioPrestadorResult"
})
@XmlRootElement(name = "ValidarUsuarioPrestadorResponse")
public class ValidarUsuarioPrestadorResponse {

    @XmlElement(name = "ValidarUsuarioPrestadorResult", nillable = true)
    protected RetornoUsuarioPrestador validarUsuarioPrestadorResult;

    /**
     * Gets the value of the validarUsuarioPrestadorResult property.
     * 
     * @return
     *     possible object is
     *     {@link RetornoUsuarioPrestador }
     *     
     */
    public RetornoUsuarioPrestador getValidarUsuarioPrestadorResult() {
        return validarUsuarioPrestadorResult;
    }

    /**
     * Sets the value of the validarUsuarioPrestadorResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link RetornoUsuarioPrestador }
     *     
     */
    public void setValidarUsuarioPrestadorResult(RetornoUsuarioPrestador value) {
        this.validarUsuarioPrestadorResult = value;
    }

}
