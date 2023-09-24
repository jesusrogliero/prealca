import Home from '../views/Home.vue'
import login from '../views/login.vue';
import primariesProducts from '../views/PrimariesProducts.vue';
import ProductsNoConforming from '../views/ProductsNoConforming.vue';
import ProductsFinals from '../views/ProductsFinal.vue';
import MachinariesConsumable from '../views/MachinariesConsumable.vue';
import CleaningSupplies from '../views/CleaningSupplies.vue';
import CleaningTools from '../views/CleaningTools.vue';
import Employes from '../views/Employes.vue';
import Militiamen from '../views/Militiamen.vue';
import Users from '../views/Users.vue';
import Roles from '../views/Roles.vue';
import purchases from '../views/PurchasesOrders.vue';
import providers from '../views/Providers.vue';
import Formulas from '../views/Formulas.vue';
import LinesProductions from '../views/LinesProductions.vue';
import ProductionsOrders from '../views/ProductionsOrders.vue';
import SuppliesMinors from '../views/SuppliesMinors.vue';
import SuppliesMinorsNoconform from '../views/SuppliesMinorsNoconform.vue';
import Transactions from '../views/Transactions.vue';
import ProductsFinalsToWarehouses from '../views/ProductsFinalsToWarehouses.vue';
import Dispatches from '../views/Dispatches.vue';
import Prueba from '../views/Prueba.vue';

let routes = [

    // Autenticación
	{ path: '/', name: 'Home', component: Home },
	{ path: '/login', name: 'Login', component: login },
	{ path: '/transactions', name: 'Transactions', component: Transactions },

    // Almacen
	{ path: '/primaries_products', name: 'PrimariesProducts', component: primariesProducts },
	{ path: '/products_no_conforming', name: 'ProductsNoConforming', component: ProductsNoConforming },
	{ path: '/products_finals', name: 'ProductsFinals', component: ProductsFinals },
    { path: '/purchases_orders', name: 'PurchasesOrders', component: purchases },
    { path: '/supplies_minors', name: 'SuppliesMinors', component: SuppliesMinors},
	{ path: '/supplies_minors_noconform', name: 'SuppliesMinorsNoconform', component: SuppliesMinorsNoconform},
	{ path: '/products_finals_to_warehouses', name: 'ProductsFinalsToWarehouses', component: ProductsFinalsToWarehouses},
	{ path: '/dispatches', name: 'Dispatchs', component: Dispatches},

	
    // Producción
    { path: '/formulas', name: 'Formulas', component: Formulas },
	{ path: '/lines', name: 'LinesProductions', component: LinesProductions },
	{ path: '/productions_orders', name: 'ProductionsOrders', component: ProductionsOrders},

    // Administracion
	{ path: '/providers', name: 'Providers', component: providers },
    { path: '/cleaning_supplies', name: 'CleaningSupplies', component: CleaningSupplies },
	{ path: '/cleaning_tools', name: 'CleaningTools', component: CleaningTools },
    { path: '/machinaries_consumable', name: 'MachinariesConsumable', component: MachinariesConsumable },

    // RRHH
	{ path: '/employes', name: 'Employes', component: Employes },
	{ path: '/militiamen', name: 'Militiamen', component: Militiamen },
	{ path: '/users', nconstame: 'Users', component: Users },
	{ path: '/roles', name: 'Roles', component: Roles },
	
	
	
	{ path: '/prueba', name: 'Prueba', component: Prueba },
];

export default routes;