// $Revision: 13477 $ $Date: 2011-09-02 16:44:19 -0300 (Fri, 02 Sep 2011) $
/**
 * An object to be used to identify whether a given control is enabled.
 */
window.LumisSocialNetworkEnabledValidator = {
	
	/**
	 * Returns whether a given control is enabled.
	 * @param id the control id.
	 */
	isEnabled : function(id) {
		return !(LumisSocialNetworkEnabledValidator.isDisabled(id));
	},
	
	/**
	 * Returns whether a given control is disabled.
	 * @param id the control id.
	 */
	isDisabled : function(id) {
		return $("#" + id).attr("disabled");
	}
};