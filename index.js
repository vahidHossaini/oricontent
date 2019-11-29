var eval=require("eval")
var uuid=require('uuid')
module.exports = class paymentConfig
{
  constructor(config,dist)
  {
    console.log('config is',config.statics)
    this.config=config.statics
    this.context=this.config.context 
    this.names=config.names    
    this.bootstrap=require('./bootstrap.js')
    this.enums=require('./struct.js') 
    this.tempConfig=require('./config.js')

    this.conf={}
  }
  async updateStruct(msg,func,self)
  {
    var dt=msg.data
    var obj=await global.db.SearchOne(self.context,'content_structure',{where:{_id:{$eq:dt.id}}})
    if(obj)
    {
      await global.db.Save(self.context,'content_structure',["_id"],{_id:dt.id,title:dt.title})
      return func(null,{i:true})
    }
    return func({m:"cnt002"})
  }
  async saveStruct(msg,func,self)
  {
    var dt=msg.data
    var obj=await global.db.SearchOne(self.context,'content_structure',{where:{name:{$eq:dt.name}}})
	if(!obj)
	{
		dt._id=uuid.v4();
	}  
	for(var a of dt.props)
	{
		if(a.name=="isConfirmed")
			return func({m:"cnt002"})
	}
	if(obj)
		delete dt._id
	else
		dt._id=uuid.v4();
    await global.db.Save(self.context,'content_structure',["name"],dt)
    return func(null,{i:true,id:dt._id})    
  }
  async saveStructure(msg,func,self)
  {
    var dt=msg.data
    //if(!self.names[dt.name])
    //  return func({m:"cnt007"})
    var obj=await global.db.SearchOne(self.context,'content_structure',{where:{_id:{$eq:dt.id}}})
    if(!obj)
      return func({m:"cnt002"})
    if(dt.prop.name == "isConfirmed")  
    {
      return func({m:"cnt005"})
    }
    //delete null property
    for(var x=obj.props.length-1;x>=0;x--)
    {
      if(!obj.props[x])
        obj.props.splice(x,1)
    }
    var index=obj.props.findIndex(p=>p.name==dt.prop.name)
    if(index>-1)
    {
      obj.props[index]=dt.prop
    }
    else
    {
      obj.props.push(dt.prop)
    }
    await global.db.Save(self.context,'content_structure',["name"],obj)
    return func(null,{i:true})    
  } 
  async deleteStructure(msg,func,self)
  {
    var dt=msg.data
    try{
      var obj=await global.db.SearchOne(self.context,'content_structure',{where:{_id:{$eq:dt.id}}})
      if(!obj)
        return func({m:"cnt002"})

        await global.db.Save(self.context,'content_structure',["_id"],{_id:obj._id,isDelete:true})
        return func(null,{i:true})
    }catch(exp){

    }

  }
  async loadStructure(msg,func,self)
  {
    var dt=msg.data
    try{
      
      console.log('>>>',self.context)
      var obj=await global.db.Search(self.context,'content_structure',{where:{isDelete:{$ne:true}}},dt)
    }catch(exp){
      console.log(exp)
    } 
    return func(null,obj)
  }
  async newStructure(msg,func,self)
  {
    var dt=msg.data
    //if(!self.names[dt.name])
    //  return func({m:"cnt007"})
    var obj=await global.db.SearchOne(self.context,'content_structure',{where:{$and:[{name:{$eq:dt.name}},{isDelete:{$ne:true}}]}})
    if(obj)
      return func({m:"cnt001"})
    obj={_id:uuid.v1(),name:dt.name,props:[],title:""}
    try{

    await global.db.Save(self.context,'content_structure',["_id"],obj)
    }catch(exp){
      console.log('--->',exp)
    }
    return func(null,{i:true})
  }
  isValid(obj)
  {
    if(obj==null  || (typeof obj === 'undefined'))
      return false
    return true  
  }
  async getConfig(name,self)
  { 
    var xx= await global.db.SearchOne(self.context,'content_config',{where:{name:name}})
    return  xx
  }
  async saveConfig(msg,func,self)
  {
    var dt=msg.data
    if(!self.names[dt.name])
      return func({m:"cnt007"})
    await global.db.Save(self.context,'content_config',["name"],dt)
    self.conf[dt.name]=self.conf
  }
  async loadConfig(msg,func,self)
  {
    var dt=msg.data
    var data= await self.getConfig(dt.name,self)
    return func(null,data)
  }
  async addData(msg,func,self)
  {
    var dt=msg.data
    var session=msg.session
    try{
      var obj=await global.db.SearchOne(self.context,'content_structure',{where:{$and:[{name:{$eq:dt.name},},{isEnable:true}]}})      
    }catch(exp){
      console.log(exp)
    } 
    if(!obj)
      return func({m:"cnt002"})
    var s=dt.objData  
    var forceArray=[]
    var minArray=[]
    for(var a of obj.props)
    {
      console.log(a)
      if(a.name=="price")
        var cc=0
      var n=a.name
      var ise=self.isValid(s[n]) 
      if(a.automatic)
      { 
        var f= eval("module.exports =function(dt,session){return "+a.automatic+" }")
         s[n] =f(dt,session) 
        continue
      }
      if(a.bindTo)
      {
        if(!s[a.bindTo.prop] || s[a.bindTo.prop]!=a.bindTo.value)
          continue
      }
      if(!ise && a.isForce)
      {
        forceArray.push({title:a.title,})
      }
      if((a.min || a.max) && !ise)
      {
        minArray.push({title:a.title,min:a.min,max:a.max})
        continue
      }

      if(a.min)
      {
        if(
          ((a.isArray ||typeof(s[n])=="string" ) && (!self.isValid (s[n].length) || s[n].length<a.min))||
          ((typeof(s[n])=="number") && (!self.isValid (s[n]) || s[n]<a.min))        
        )
        {
          minArray.push({title:a.title,min:a.min,max:a.max})
          continue
        }
      }
      if(a.max)
      {
        if(
          ((a.isArray ||typeof(s[n])=="string" ) && (!self.isValid (s[n].length) || s[n].length>a.max))||
          ((typeof(s[n])=="number") && (!self.isValid (s[n]) || s[n]>a.max))          
        )
        {
          minArray.push({title:a.title,min:a.min,max:a.max})
          continue
        }
      }

    }
    if(forceArray.length || minArray.length)
      return func({m:"cnt003",data:{force:forceArray,min:minArray}})
    for(var a in s)
    {
      var dx=obj.props.filter(p=>p.name==a)
      if(!dx.length)
        return func({m:"cnt004",data:a})
    }
    s._id=uuid.v1()
    var dt =  await global.db.Save(self.context,'content_'+dt.name,["_id"],s)
    return func(null,dt)
  }
  async updateDataAdmin(msg,func,self)
  {
    var dt=msg.data
    var session=msg.session
    if(!dt.objData._id)
    {
      return self.addData(msg,func,self)
    }
    var dt =  await global.db.Save(self.context,'content_'+dt.name,["_id"],dt.objData )
    return func(null,dt)
  }
  async loadDataForAdmin(msg,func,self)
  {
    var dt=msg.data
    if(!dt.$top || dt.$top<self.config.top)
      dt.$top = self.config.top
    var conf=self.conf[dt.name]
    if(!conf)
    {
      self.conf[dt.name]=await self.getConfig(dt.name,self)
      conf=self.conf[dt.name]
    }  
    var query={}  
    if(conf && conf.brief)
      query.select=conf.brief
    var data=await global.db.Search(self.context,'content_'+dt.name,query,dt)
    return func(null,data)
  }
  async loadData(msg,func,self)
  {
    var dt=msg.data
    if(!dt. $top || dt.$top<self.config.top)
      dt.$top = self.config.top
      var conf=self.conf[dt.name]
      if(!conf)
      {
        self.conf[dt.name]=await self.getConfig(dt.name,self)
        conf=self.conf[dt.name]
      }  
    var query={where:{isConfirmed:true}}  
    if(conf && conf.brief)
      query.select=conf.brief
      try{
        var data=await global.db.Search(self.context,'content_'+dt.name,query,dt)

      }catch(exp){
        console.log(exp)
      } 
    return func(null,data)
  }
  async getSingle(msg,func,self)
  {
    var dt=msg.data
    var session=msg.session
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    if(data && ! data.isConfirmed) 
        return func({m:"cnt006"})
    return func(null,data)
  }
  
  async  getMyData(msg,func,self)
  { 
    var dt=msg.data
    var session=msg.session
    if(!dt. $top || dt.$top<self.config.top)
      dt.$top = self.config.top
      var conf=self.conf[dt.name]
      if(!conf)
      {
        self.conf[dt.name]=await self.getConfig(dt.name,self)
        conf=self.conf[dt.name]
      }  
    var query={where:{submiter:session.userid}}  
    if(conf && conf.brief)
      query.select=conf.brief
      console.log(query)
      try{
        var data=await global.db.Search(self.context,'content_'+dt.name,query,dt)

      }catch(exp){
        console.log(exp)
      } 
    return func(null,data)
  }
  async getMySingle(msg,func,self)
  {
    var dt=msg.data
    var session=msg.session
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    if(data && ! data.isConfirmed)
      if(session.userid!=data.submiter)
        return func({m:"cnt006"})
    return func(null,data)
  }
  async deleteMyData(msg,func,self)
  {
    var dt=msg.data
    var session=msg.session
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    if(!data || data.isConfirmed)
      return func({m:"cnt006"})
    if(session.userid!=data.submiter)
      return func({m:"cnt006"})
      
    await global.db.Delete(self.context,'content_'+dt.name,["_id"],{_id:dt._id})
    return func(null,data)
  }
  
  
  async acceptData(msg,func,self)
  {
    var dt=msg.data
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    if(!data )
      return func({m:"cnt006"})
      
    await global.db.Save(self.context,'content_'+dt.name,["_id"],{_id:dt._id,isConfirmed:true})
    return func(null,{i:true})
    
  }
  
  async rejectData(msg,func,self)
  {
    var dt=msg.data
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    if(!data )
      return func({m:"cnt006"})
      
    await global.db.Save(self.context,'content_'+dt.name,["_id"],{_id:dt._id,isConfirmed:false})
    return func(null,{i:true})
    
  }
  async getSingleForAdmin(msg,func,self)
  {
    var dt=msg.data
    var data=await global.db.SearchOne(self.context,'content_'+dt.name,{where:{_id:dt._id}})
    return func(null,data)
  }
  async getModel(msg,func,self)
  {
    var dt=msg.data
    var obj=await global.db.SearchOne(self.context,'content_structure',{where:{name:{$eq:dt.name}}})
	var str=""
	var otherclass="";
	if(obj)
	{
		str+=`
		
		@JsonSerializable()
		class ${obj.name}Model{
		`
		for(var a of obj.props)
		{
			if(a.type==1 || a.type==2 ||a.type==10||a.type==11||a.type==12||a.type==13||a.type==14) 
				str+="final String "+a.name+";\r\n"; 
			if(a.type==5)
			{
				if(a.config && a.config.type=="external")
				{
					otherclass+=`
					class ${a.name}Config
					{
						final String ${a.config.id} ;
					`;
				
					for(var y of a.config.title)
						otherclass+="final String "+y+" ;";
					otherclass+="}";
				str+="final List<"+a.name+"Config> "+a.name+";\r\n"; 
				}
				else
				str+="final int "+a.name+" ;\r\n"; 
			}
			if(a.type==3 ||a.type==8)
			{
				if(a.config && a.config.type=="external")
				{
					otherclass+=`
					class ${a.name}Config
					{
						final String ${a.config.id} ;
					`;
				
					for(var y of a.config.title)
						otherclass+="final String "+y+" ;";
					otherclass+="}";
				str+="final "+a.name+"Config "+a.name+";\r\n"; 
				}
				else
				{
					str+="final baseItemConfig "+a.name+";\r\n";
				}
			}
		}
		str+=` 
		${obj.name}Model({
		`
		for(var a of obj.props)
		{
			str+="this."+a.name+","
		}
		str+="});"
		str+="}";
	}
	var st=`
		import 'package:json_annotation/json_annotation.dart';
		part '${obj.name}.model.g.dart';`+
	otherclass+str
	for(var a=0;a<1000;a++)
	{
		st=st.replace("\r","").replace("\n","").replace("\t","");
	}
	return func(null,st)
  }
  test(msg,func,self)
  {
    return func(null,{i:true})
  }
  
}