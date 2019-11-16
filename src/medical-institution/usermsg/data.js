const treeData = [
  {
    name: "河北省卫健委",
    children: [
      {
        name: "石家庄市卫健委",
        children: [
          {
            name: "桥西区卫健委"
          },
          {
            name: "辛集市卫健委"
          }
        ]
      },
      {
        name: "保定市卫健委",
        children: [{ name: "定州市卫健委" }]
      },
      {
        name: "秦皇岛市卫健委"
      },
      {
        name: "雄安新区",
        children: [{ name: "雄县" }, { name: "雄安新县" }, { name: "容城县" }]
      }
    ]
  }
];

const deptData = [
  { id: "0", name: "0部门" },
  { id: "1", name: "1部门" },
  { id: "2", name: "2部门" },
  { id: "3", name: "3部门" }
];

const tableData = [
  { name: "", dept: "石家庄市卫健委", 状态: "开通" },
  { name: "", dept: "桥西区卫健委", 状态: "禁用" }
];

export { treeData, deptData, tableData };
