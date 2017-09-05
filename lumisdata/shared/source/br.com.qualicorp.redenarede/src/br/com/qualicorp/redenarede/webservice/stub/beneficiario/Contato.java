
package br.com.qualicorp.redenarede.webservice.stub.beneficiario;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for Contato complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Contato">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="email" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="departamento" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="codigoContato" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="nomeContato" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="telefoneContato" type="{http://ws.common.tempoassist.com.br/schema}Telefone" minOccurs="0"/>
 *         &lt;element name="telefoneFax" type="{http://ws.common.tempoassist.com.br/schema}Telefone" minOccurs="0"/>
 *         &lt;element name="telefonePrincipal" type="{http://ws.common.tempoassist.com.br/schema}Telefone" minOccurs="0"/>
 *         &lt;element name="tipoContato" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Contato", namespace = "http://ws.common.tempoassist.com.br/schema", propOrder = {
    "email",
    "departamento",
    "codigoContato",
    "nomeContato",
    "telefoneContato",
    "telefoneFax",
    "telefonePrincipal",
    "tipoContato"
})
@XmlSeeAlso({
    Beneficiario.class
})
public class Contato {

    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String email;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String departamento;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Long codigoContato;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String nomeContato;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Telefone telefoneContato;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Telefone telefoneFax;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected Telefone telefonePrincipal;
    @XmlElement(namespace = "http://ws.common.tempoassist.com.br/schema", nillable = true)
    protected String tipoContato;

    /**
     * Gets the value of the email property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the value of the email property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmail(String value) {
        this.email = value;
    }

    /**
     * Gets the value of the departamento property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDepartamento() {
        return departamento;
    }

    /**
     * Sets the value of the departamento property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDepartamento(String value) {
        this.departamento = value;
    }

    /**
     * Gets the value of the codigoContato property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getCodigoContato() {
        return codigoContato;
    }

    /**
     * Sets the value of the codigoContato property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setCodigoContato(Long value) {
        this.codigoContato = value;
    }

    /**
     * Gets the value of the nomeContato property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNomeContato() {
        return nomeContato;
    }

    /**
     * Sets the value of the nomeContato property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNomeContato(String value) {
        this.nomeContato = value;
    }

    /**
     * Gets the value of the telefoneContato property.
     * 
     * @return
     *     possible object is
     *     {@link Telefone }
     *     
     */
    public Telefone getTelefoneContato() {
        return telefoneContato;
    }

    /**
     * Sets the value of the telefoneContato property.
     * 
     * @param value
     *     allowed object is
     *     {@link Telefone }
     *     
     */
    public void setTelefoneContato(Telefone value) {
        this.telefoneContato = value;
    }

    /**
     * Gets the value of the telefoneFax property.
     * 
     * @return
     *     possible object is
     *     {@link Telefone }
     *     
     */
    public Telefone getTelefoneFax() {
        return telefoneFax;
    }

    /**
     * Sets the value of the telefoneFax property.
     * 
     * @param value
     *     allowed object is
     *     {@link Telefone }
     *     
     */
    public void setTelefoneFax(Telefone value) {
        this.telefoneFax = value;
    }

    /**
     * Gets the value of the telefonePrincipal property.
     * 
     * @return
     *     possible object is
     *     {@link Telefone }
     *     
     */
    public Telefone getTelefonePrincipal() {
        return telefonePrincipal;
    }

    /**
     * Sets the value of the telefonePrincipal property.
     * 
     * @param value
     *     allowed object is
     *     {@link Telefone }
     *     
     */
    public void setTelefonePrincipal(Telefone value) {
        this.telefonePrincipal = value;
    }

    /**
     * Gets the value of the tipoContato property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTipoContato() {
        return tipoContato;
    }

    /**
     * Sets the value of the tipoContato property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTipoContato(String value) {
        this.tipoContato = value;
    }

}
