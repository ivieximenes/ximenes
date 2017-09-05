
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
 *         &lt;element name="CadastrarUsuarioPrestadorResult" type="{http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Contratos.GestaoPrestador}RetornoUsuarioPrestador" minOccurs="0"/>
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
    "cadastrarUsuarioPrestadorResult"
})
@XmlRootElement(name = "CadastrarUsuarioPrestadorResponse")
public class CadastrarUsuarioPrestadorResponse {

    @XmlElement(name = "CadastrarUsuarioPrestadorResult", nillable = true)
    protected RetornoUsuarioPrestador cadastrarUsuarioPrestadorResult;

    /**
     * Gets the value of the cadastrarUsuarioPrestadorResult property.
     * 
     * @return
     *     possible object is
     *     {@link RetornoUsuarioPrestador }
     *     
     */
    public RetornoUsuarioPrestador getCadastrarUsuarioPrestadorResult() {
        return cadastrarUsuarioPrestadorResult;
    }

    /**
     * Sets the value of the cadastrarUsuarioPrestadorResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link RetornoUsuarioPrestador }
     *     
     */
    public void setCadastrarUsuarioPrestadorResult(RetornoUsuarioPrestador value) {
        this.cadastrarUsuarioPrestadorResult = value;
    }

}
