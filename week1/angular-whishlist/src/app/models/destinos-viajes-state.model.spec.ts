import {
  reducerDestinosViajes,
  DestinosViajesState,
  initializeDestinosViajesState,
  InitMyDataAction,
  NuevoDestinoAction,
  ElegidoFavoritoAction
} from './destino-viajes-states.models';
import { DestinoViaje } from './destino-viaje.model';

describe('reducerDestinosViajes', () => {
  it('should reduce init data', () => {
    //setup test
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: InitMyDataAction = new InitMyDataAction(['destino 1', 'destino 2']);
    //action
    const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
    //assertions
    expect(newState.items.length).toEqual(2);
    expect(newState.items[0].nombre).toEqual('destino 1');
    //tear down
   
    // si estuvieramos trabajando con una base de datos aqui debemos insertar
    //el codigo nesesario para borrar las inserciones echas en la base de datos
    //por las actions
  });

  it('should reduce new item added', () => {
    //setup
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona', 'url'));
    //action
    const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
    //assertions
    expect(newState.items.length).toEqual(1);
    expect(newState.items[0].nombre).toEqual('barcelona');
  });

  /*it('should reduce new item Favorito', () => {
    //setup
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    //const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona', 'url'));
    const action2: ElegidoFavoritoAction = new ElegidoFavoritoAction(new DestinoViaje('barcelona', 'url'));
    //action
    const newState: DestinosViajesState = reducerDestinosViajes(prevState, action2);
    //assertions
    expect(newState.favorito.isSelected.arguments).toBe(true)
    //expect(newState.items[0].nombre).toEqual('barcelona');
  });*/

  
});
