module.exports = class paymentConfig
{
  
    constructor(config)
    { 
         
    }
    getPackages()
    {
       return [
       {name:"eval"}
       ]
    }
    getMessage()
	{
		return{
			default001:"", 
		}
	}
    getVersionedPackages()
    { 
      return []
    }
    getDefaultConfig()
    {
      return {
		context:"default",  
		 
      }
    }
}