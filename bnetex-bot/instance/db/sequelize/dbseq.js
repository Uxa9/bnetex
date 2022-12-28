const { Sequelize, DataTypes } = require("sequelize");

const connection__params = {
  database: "exchange",
  username: "mysql",
  password: "mysql",
};

var sequelize = new Sequelize(
  connection__params.database,
  connection__params.username,
  connection__params.password,
  {
    host: connection__params.host,
    dialect: "mysql",
    pool: {
      max: 60,
      min: 0,
      acquire: 30000,
      idle: 10000,
      maxConnections: 100,
      maxIdleTime: 1000,
    },
    logging: false,
  }
);

module.exports.setup = async () => {
  syncAssotiations();

  await sequelize.sync({ alter: true });
};

const models = {
  Pattern: require("./models/pattern")(sequelize, DataTypes),
  PatternTrigger: require("./models/patternTriggers")(sequelize, DataTypes),    
  ActiveGroups: require("./models/activeGroups")(sequelize, DataTypes),
  ActiveGroupTriggers: require("./models/activeGroupTriggers")(sequelize, DataTypes),
  Rules: require("./models/rules")(sequelize, DataTypes),  
  PositionEnters:require("./models/PositionEnters")(sequelize, DataTypes),  
  Position: require("./models/position")(sequelize, DataTypes),
  
  
};

let syncAssotiations = () => {

  //this.models.Pattern.hasMany(this.models.PatternConditions);
  //this.models.PatternConditions.belongsTo(this.models.Pattern)

  this.models.Pattern.hasMany(this.models.PatternTrigger);
  this.models.PatternTrigger.belongsTo(this.models.Pattern)

  this.models.Pattern.hasMany(this.models.ActiveGroups);
  this.models.ActiveGroups.belongsTo(this.models.Pattern)


  this.models.ActiveGroups.hasMany(this.models.Position);
  this.models.Position.belongsTo(this.models.ActiveGroups)

  this.models.ActiveGroups.hasMany(this.models.ActiveGroupTriggers);
  this.models.ActiveGroupTriggers.belongsTo(this.models.ActiveGroups)
  
  
  this.models.ActiveGroups.hasMany(this.models.Rules);
  this.models.Rules.belongsTo(this.models.ActiveGroups)


  


  this.models.Position.hasMany(this.models.PositionEnters);

  this.models.PositionEnters.belongsTo(this.models.Position)

};

module.exports.models = models;
