  const curry = func => {
    return function curried ( ...args ) {
      return ( args.length >= func.length ) ?
          func.apply ( this, args )
        : ( ...args2 ) => curried.apply ( this, args.concat ( args2 ) )  
      }
  }
  
  const mcompose =  ( ...fns ) => x => fns.reduceRight ( ( y, f ) => f ( y ), x ); // many composition
  
  const compose = ( f , g ) => x => f ( g ( x ) )

  const I  = x => x
  const K  = x => y => x
  const A  = f => x => f ( x )
  const T  = x => f => f ( x )
  const W  = f => x => f ( x )( x )
  const C  = f => y => x => f ( x )( y )
  const B  = f => g => x => f ( g ( x ) )
  const S  = f => g => x => f ( x )( g ( x ) )
  const S_ = f => g => x => f ( g ( x ) )( x )
  const S2 = f => g => h => x => f ( g ( x ) )( h ( x ) )
  const P  = f => g => x => y => f ( g ( x ) )( g ( y ) )
  const Y  = f => ( g => g ( g ) )( g => f ( x => g ( g )( x ) ) )
  
  const lazy = arg => _ => arg
  
  const functor = f => x => { f ( x ) ; return x }
  
  const print = console.log

  const not = x => !x

  const truth = x => not ( not ( not ( x ) ) )

  const iff = ( v1, v2 ) => test1 => test1 ? v1 : v2
  
  // const iffav = ( f1, f2 ) => x => test1 => test1 ? f1 ( x ) : f2 ( x )
  
  const iffav = compose ( A , curry ( iff ) )
  
  // const iffva = ( f1, f2 ) => test1 => x => test1 ? f1 ( x ) : f2 ( x )
  
  // const iffva = C ( curry ( iff ) )
  
  const runnu = maybefunc => iff ( maybefunc, I )( typeof maybefunc == 'function' )(  ) // run not undefined
  
  const runnua = maybefunc => curry ( iff ( maybefunc, I )( typeof maybefunc == 'function' ) )

  const iffnav = ( v1, v2 ) => test => runnua ( iff ( v1, v2 )( test ) )



  const moveCreepToPossition = crepp => possx => crepp.moveTo ( possx )
  
  const creepRoomFind = crepp => source => crepp.room.find( source )
  
  const creepFind = crepp => location => creepRoomFind ( crepp )( location )[0]
  
  const creepHarvest = crepp => source => crepp.harvest ( location )
  
  const creepTransfer = crepp => curry ( crepp.transfer ) 
  
  const creepGetFreeCapacity = crepp => crepp.store.getFreeCapacity()
  
  
  const creepmovetoIF = iffnav ( moveCreepToPossition ) 
  
  const findLocationWithCreepAndGoTo = ( crepp, src, eqlv ) =>
    creepmovetoIF ( creepHarvest ( crepp )( creepFind ( crepp )( src ) ) != eqlv )
  
  const withCreepFindLocationAndGoToThen = ( crepp, src, eqvl ) => 
    findLocationWithCreepAndGoTo ( crepp, src, eqvl )( crepp )( creepFind ( crepp )( src ) )
  
  const withCreepTransferSomethingWheretoLocation = ( crepp, location, something, whereis ) => 
    iff ( moveCreepToPossition ( crepp )( location ) )
        ( creepTransfer ( crepp )( location )( something ) == whereis )
  
  
  const FP_SPAWNLOCATION = Game.spawns['Spawn1']
  const FP_RANGE = ERR_NOT_IN_RANGE
  const FP_SOURCE_ENERGY = RESOURCE_ENERGY
  const FP_FIND_SOURCE = FIND_SOURCES
  
  const onCreepFindSpawnAndTransferEnergyForSpawnWithCreepIN = ( creppp, range ) =>
    curry ( withCreepTransferSomethingWheretoLocation )( creppp )( FP_SPAWNLOCATION )( FP_SOURCE_ENERGY )( range )
  
  const onCreepFindSourceEnergyAndGoToThen = ( crepp, range ) => 
    curry ( withCreepFindLocationAndGoToThen )( crepp )( FP_FIND_SOURCE )( range )
  
  const verifySpawnCapacityIsFreeThenTransferEnergyWhileThis = ( creppp, range ) => 
    iffnav
    ( onCreepFindSourceEnergyAndGoToThen, onCreepFindSpawnAndTransferEnergyForSpawnWithCreepIN )
    ( creepGetFreeCapacity ( creppp ) > 0 )
    ( creppp )( range )
  
  const supplySpawnWithCreep = crepp => verifySpawnCapacityIsFreeThenTransferEnergyWhileThis ( crepp, FP_RANGE )
  
  const mapCreepsAndSupplySpawnWithThen = () => Object.keys(Game.creeps).forEach ( nameCreep => 
    supplySpawnWithCreep ( Game.creeps[nameCreep] ) )
  
  const begin = () => mapCreepsAndSupplySpawnWithThen (  ) 


  module.exports.loop = function () {
      
    begin();
  }
  
