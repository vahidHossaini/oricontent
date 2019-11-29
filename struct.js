module.exports={
  testModel:{
    title:{type:'number',nullable:false},
  },
  propModel:{
    struct:{
      title:{type:'string',nullable:false},
      name:{type:'string',nullable:false},
      description:{type:'string',nullable:true},
      type:{type:'typeModel',nullable:true},
      min:{type:'number',nullable:true},
      max:{type:'number',nullable:true},
      check:{type:'string',nullable:true},
      searchable:{type:'bool',nullable:true},
      isForce:{type:'bool',nullable:true},
      isArray:{type:'bool',nullable:true},
      isEnable:{type:'bool',nullable:true},
      automatic:{type:'string',nullable:true},
      params:{type:'elementItem',nullable:true,isArray:true},
      bindTo:{type:'bindItem',nullable:true},
      default:{type:'bindItem',nullable:true},
    }
  },
  bindItem:{
    struct:{
      prop:{type:'string',nullable:false},
      value:{type:'string',nullable:false},
    }
  },
  elementItem:{
    struct:{
      id:{type:'number',nullable:false},
      title:{type:'string',nullable:false},
    }
  },
  typeModel:{
    sinleText:1,
    multiText:2,
    dropDown:3,
    checkBox:4,
    smallCheckBoxArray:5,
    checkBoxArray:6,
    numberText:7,
    tag:8,
    geoLocation:9,
    radio:9,
    upload:10,
    date:11,
    time:12,
    dateTime:13,
    password:14,
    geoLocation:15
  }
}