
package br.com.qualicorp.redenarede.webservice.stub.pretador;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TipoDocumento.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TipoDocumento">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="CPF"/>
 *     &lt;enumeration value="CNPJ"/>
 *     &lt;enumeration value="RG"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "TipoDocumento", namespace = "http://schemas.datacontract.org/2004/07/Qualicorp.GSP.Dominio.Comuns")
@XmlEnum
public enum TipoDocumento {

    CPF,
    CNPJ,
    RG;

    public String value() {
        return name();
    }

    public static TipoDocumento fromValue(String v) {
        return valueOf(v);
    }

}
