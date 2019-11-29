module.exports = class paymentBootstrap{
  constructor(config)
  {
    this.funcs=[
      {
          name:'test',
          title:'test' ,
          inputs:[
          {
              name:'id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'updateStruct',
          title:'updateStruct' ,
          inputs:[
          {
              name:'id',
              type:'string',
              nullable:false},
          {
              name:'title',
              type:'string',
              nullable:false},
          ]
      },
      {
          name:'deleteStructure',
          title:'test' ,
          inputs:[
          {
              name:'id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'loadStructure',
          title:'test' , 
      },
      {
          name:'getModel',
          title:'test' , 
      },
      {
          name:'saveStruct',
          title:'save structure' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'saveStructure',
          title:'save exist structure' ,
          inputs:[
          {
              name:'id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'newStructure',
          title:'add new structure' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'saveConfig',
          title:'save config' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'loadConfig',
          title:'load config' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'addData',
          title:'add data to exist structure' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'updateDataAdmin',
          title:'update data to exist structure' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'loadDataForAdmin',
          title:'load all data' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'loadData',
          title:'load confirmed data' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'getSingle',
          title:'get confirmed data by id ' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false},
          {
              name:'_id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'getSingleForAdmin',
          title:'get data by id ' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false},
          {
              name:'_id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'acceptData',
          title:'get data by id ' ,
          inputs:[ 
            {
                name:'name',
                type:'string',
                nullable:false},
            {
              name:'_id',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'rejectData',
          title:'get data by id ' ,
          inputs:[ 
            {
                name:'name',
                type:'string',
                nullable:false},
          {
              name:'_id',
              type:'string',
              nullable:false}
          ]
      },

      
    {
        name:'getMyData',
        title:'getMyData'  
    },
    {
        name:'getMySingle',
        title:'getMySingle' ,
        inputs:[
        {
            name:'_id',
            type:'string',
            nullable:false}
        ]
    },
      
    ]
    this.auth=['test','getSingle','loadData','loadStructure','addData','loadData','acceptData','acceptReject','updateDataAdmin','getModel']
  }
}