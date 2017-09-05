
package br.com.qualicorp.redenarede.webservice.stub.beneficiario;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for Operadora complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Operadora">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="cnpj" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="codigo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="codigoSistema" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="descricao" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="areas" type="{http://ws.common.tempoassist.com.br/schema}Enumerado" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="codigoConnectmed" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="pathLogo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Operadora", namespace = "http://ws.common.tempoassist.com.br/schema", propOrder = {
    "cnpj",
    "codigo",
    "codigoSistema",
    "descricao",
    "areas",
    "codigoConnectmed",
    "pathLogo"
})
public class Operadora {

    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String cnpj;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String codigo;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String codigoSistema;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String descricao;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected List<Enumerado> areas;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String codigoConnectmed;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String pathLogo;

    /**
     * Gets the value of the cnpj property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCnpj() {
        return cnpj;
    }

    /**
     * Sets the value of the cnpj property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCnpj(String value) {
        this.cnpj = value;
    }

    /**
     * Gets the value of the codigo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCodigo() {
        return codigo;
    }

    /**
     * Sets the value of the codigo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCodigo(String value) {
        this.codigo = value;
    }

    /**
     * Gets the value of the codigoSistema property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCodigoSistema() {
        return codigoSistema;
    }

    /**
     * Sets the value of the codigoSistema property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCodigoSistema(String value) {
        this.codigoSistema = value;
    }

    /**
     * Gets the value of the descricao property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescricao() {
        return descricao;
    }

    /**
     * Sets the value of the descricao property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescricao(String value) {
        this.descricao = value;
    }

    /**
     * Gets the value of the areas property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the areas property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAreas().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Enumerado }
     * 
     * 
     */
    public List<Enumerado> getAreas() {
        if (areas == null) {
            areas = new ArrayList<Enumerado>();
        }
        return this.areas;
    }

    /**
     * Gets the value of the codigoConnectmed property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCodigoConnectmed() {
        return codigoConnectmed;
    }

    /**
     * Sets the value of the codigoConnectmed property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCodigoConnectmed(String value) {
        this.codigoConnectmed = value;
    }

    /**
     * Gets the value of the pathLogo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPathLogo() {
        return pathLogo;
    }

    /**
     * Sets the value of the pathLogo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPathLogo(String value) {
        this.pathLogo = value;
    }

}
