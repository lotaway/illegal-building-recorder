Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  类型
    type: {
      type: String,
      value: "text"
    },
    //  唯一标识
    id: {
      type: String,
      value: ""
    },
    //  表单元素名称
    name: {
      type: String,
      value: ""
    },
    //  值
    value: {
      type: String,
      value: ""
    },
    placeholder: {
      type: String,
      value: ""
    },
    eventHandler: {
      type: String,
      value: "eventHandler"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBlur(e) {
      this.triggerEvent(this.properties.eventHandler, e);
    }
  }
})