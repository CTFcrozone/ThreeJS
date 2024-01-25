import * as THREE from "https://cdn.skypack.dev/three@0.132.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.132.0/examples/jsm/loaders/GLTFLoader.js";

const kontener3d = document.querySelector("#kontener3d");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight, 0.1,1000);
const clock = new THREE.Clock();

let object;
let mixer;
let objToRender = 'mew';

const loader = new GLTFLoader(); // Inicjalizacja Loadera
loader.load(
    `models/${objToRender}/scene.gltf`, // Ścieżka do pliku .gltf
    //Dodawanie do sceny
    function (gltf){
        object = gltf.scene; // Wczytany model zapisywany jest do zmiennej object.
        scene.add(object); // Dodajemy wczytany model do sceny.
        mixer = new THREE.AnimationMixer(object); //Inicjalizujemy obiekt do obsługi animacji na wczytanym modelu.
        mixer.clipAction(gltf.animations[0]).play(); // Uruchamiamy pierwszą animację z wczytanego modelu.
        animate();
    },
    //Rejestr ładowania modelu
    function(xhr){
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    //errory
    function (error){
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({alpha: true}); // jest kluczowe, gdy chcemy zachować przezroczystość tła (bez tego model 'mew' się nie renderuje)
renderer.setSize(window.innerWidth,window.innerHeight); // zapewnia, że renderowany obraz będzie odpowiednio dopasowany do widocznego obszaru

kontener3d.appendChild(renderer.domElement); // Dodanie obszaru, na którym rysowane są obiekty 3D do elementu o id "kontener3d"

camera.position.z = 25;

const topLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );; // Źródło światła umieszczone bezpośrednio nad sceną, z kolorem przechodzącym od koloru nieba do koloru podłoża.
topLight.position.set(500,500,500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333,5); // Światło to oświetla równomiernie wszystkie obiekty w scenie.
scene.add(ambientLight);

function animate(){
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // reprezentuje czas (w sekundach), jaki upłynął od ostatniego klatkowania. 
    if(mixer){
        mixer.update(delta); //Jeśli istnieje obiekt odpowiedzialny za obsługę animacji, to aktualizuj jego stan na podstawie zmiany czasu (delta).
    }
    if(object){
       object.rotation.y += 0.01; //rotacja modelu wokół wlasnej osi
    }
    renderer.render(scene,camera); //renderowanie
}
window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
