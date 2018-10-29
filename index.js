// https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
// window.localStorage.clear()
var Contacts = {
    // El mecanismo de almacenamiento local permite almacenar datos durante más de una sesión. 
    // El acceso al almacenamiento local está disponible a través del objeto global localStorage. 
    // Los datos almacenados en el área de almacenamiento local son persistentes y no están limitados 
    // a la vida útil de la ventana / pestaña. Es decir, si cierro la pestaña y la vuelvo a abrir los datos
    // almacenados seguirán vigentes. Sólo se pierden cuando cierro el navegador
    index: window.localStorage.getItem("Contacts:index"),
    $table: document.getElementById("contacts-table"),
    $form: document.getElementById("contacts-form"),
    $button_save: document.getElementById("contacts-op-guardar"),
    $button_discard: document.getElementById("contacts-op-limpiar"),

    init: function() {
        // Inicializamos el índice de almacenamiento en 1
        if (!Contacts.index) {
            window.localStorage.setItem("Contacts:index", Contacts.index = 1);
        }

        // Inicializamos el formulario
        Contacts.$form.reset();
        // Si le doy click al botón Limpiar se resetea el form y el id se cambia a 0
        Contacts.$button_discard.addEventListener("click", function(event) {
            Contacts.$form.reset();
            Contacts.$form.id_entry.value = 0;
        }, true);
        // Si le doy click al botón Guardar (tipo submit) toma los valores
        // del formulario según su name
        Contacts.$form.addEventListener("submit", function(event) {
            var entry = {
                id: parseInt(this.id_entry.value),
                first_name: this.first_name.value,
                last_name: this.last_name.value,
                address: this.address.value,
                phone: this.phone.value,
                email: this.email.value
            };
            if (entry.id == 0 && entry.first_name.length>0) { // add
                Contacts.storeAdd(entry);
                Contacts.tableAdd(entry);
            }
            else { // edit
                Contacts.storeEdit(entry);
                Contacts.tableEdit(entry);
            }

            this.reset();
            this.id_entry.value = 0;
            event.preventDefault();
        }, true);

        // Inicializamos la tabla
        if (window.localStorage.length - 1) {
            // Creo el arreglo contact_list, el iterador i y una variable key
            var contacts_list = [], i, key;
            for (i = 0; i < window.localStorage.length; i++) {
                key = window.localStorage.key(i);
                if (/Contacts:\d+/.test(key)) {
                    contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
                }
            }
            
            // Si el tamaño del arreglo contacts_list existe, lo ordenamos
            if (contacts_list.length) {
                contacts_list.sort(function(a, b) {
                    return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                })
                .forEach(Contacts.tableAdd);
            }
        }
        Contacts.$table.addEventListener("click", function(event) {
            var op = event.target.getAttribute("data-op");
            // El método test() prueba una coincidencia en una cadena. 
            // Este método devuelve verdadero si encuentra una coincidencia; de lo contrario, devuelve falso.
            if (/edit|remove/.test(op)) {
                var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
                if (op == "edit") {
                    Contacts.$form.first_name.value = entry.first_name;
                    Contacts.$form.last_name.value = entry.last_name;
                    Contacts.$form.address.value = entry.address;
                    Contacts.$form.phone.value = entry.phone;
                    Contacts.$form.email.value = entry.email;
                    Contacts.$form.id_entry.value = entry.id;
                }
                else if (op == "remove") {
                    if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {
                        Contacts.storeRemove(entry);
                        Contacts.tableRemove(entry);
                    }
                }
                event.preventDefault();
            }
        }, true);
    },

    storeAdd: function(entry) {
        entry.id = Contacts.index;
        window.localStorage.setItem("Contacts:index", ++Contacts.index);
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
    },
    storeEdit: function(entry) {
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
    },
    storeRemove: function(entry) {
        window.localStorage.removeItem("Contacts:"+ entry.id);
    },

    tableAdd: function(entry) {
        var $tr = document.createElement("tr"), $td, key;
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
        $tr.appendChild($td);
        $tr.setAttribute("id", "entry-"+ entry.id);
        Contacts.$table.appendChild($tr);
    },
    tableEdit: function(entry) {
        var $tr = document.getElementById("entry-"+ entry.id), $td, key;
        $tr.innerHTML = "";
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
        $tr.appendChild($td);
    },
    tableRemove: function(entry) {
        Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
    }
};
Contacts.init();