// Імпортуємо Three.js та необхідні модулі
import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Сцена, Камера, Рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Управління (Обертання мишею)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавність руху
controls.autoRotate = true; // Авто-обертання
controls.autoRotateSpeed = 0.5;

// 3. Завантажувач PLY
const loader = new PLYLoader();
loader.load(
    'point_cloud.ply', //change file name
    function (geometry) {
        // Коли файл завантажено
        console.log('Point cloud loaded!');

        // Створюємо матеріал.
        // `vertexColors: true` каже йому брати кольори (R,G,B) з самого файлу
        const material = new THREE.PointsMaterial({
            size: 0.05, // Розмір точки (можете змінити)
            vertexColors: true
        });

        // Створюємо об'єкт (хмару точок)
        const points = new THREE.Points(geometry, material);

        // Центруємо геометрію та налаштовуємо камеру
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        points.position.sub(center); // Центруємо об'єкт
        camera.position.z = geometry.boundingBox.max.z * 1.5; // Віддаляємо камеру

        scene.add(points);
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
    (error) => console.log('Error loading PLY file:', error)
);

// 4. Світло (не обов'язково для точок, але корисно)
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// 5. Цикл рендерингу (анімація)
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Оновлення камери
    renderer.render(scene, camera);
}

// 6. Обробка зміни розміру вікна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Початок!
animate();