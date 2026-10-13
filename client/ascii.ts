// ASCII-рендер на GPU: сцена рисуется в маленькую текстуру (1 пиксель = 1 ячейка), шейдер заменяет каждую ячейку символом
// по яркости и красит его в цвет пикселя. Это пост-эффект: игровая логика и модели про него ничего не знают.
import * as THREE from 'three';

const RAMP = ' .·:;+=x†X#%@'; // от пустого к плотному

export class AsciiPass {
  private rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  private scene = new THREE.Scene();
  private cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private mat: THREE.ShaderMaterial;

  constructor(private r: THREE.WebGLRenderer, private cw = 8, private ch = 13) {
    this.mat = new THREE.ShaderMaterial({
      uniforms: { tScene: { value: this.rt.texture }, tGlyph: { value: this.atlas() }, cells: { value: new THREE.Vector2(1, 1) }, nGlyphs: { value: RAMP.length } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
      fragmentShader: `
        precision highp float;
        uniform sampler2D tScene; uniform sampler2D tGlyph; uniform vec2 cells; uniform float nGlyphs;
        varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0., 1.); }
        void main(){
          vec2 cell = floor(vUv * cells);
          vec3 c = pow(aces(texture2D(tScene, (cell + 0.5) / cells).rgb * .5), vec3(1. / 2.2));
          float l = dot(c, vec3(.299, .587, .114));
          c = mix(vec3(l), c, .62) + vec3(.07, .0, .0) * (1. - l);       // тёмное фэнтези: приглушённые цвета, красноватые тени
          float idx = floor(clamp(pow(l, .5) * 1.4, 0., .999) * nGlyphs);
          vec2 local = fract(vUv * cells);
          float g = texture2D(tGlyph, vec2((idx + local.x) / nGlyphs, local.y)).r;
          gl_FragColor = vec4(mix(c * .14, min(c * 2.1 + vec3(.04, .01, .01), 1.), g), 1.);
        }`,
      depthTest: false, depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat));
  }

  /** Размер в CSS-пикселях: сколько ячеек поместится на экране. */
  setSize(w: number, h: number) {
    const cols = Math.max(1, Math.round(w / this.cw)), rows = Math.max(1, Math.round(h / this.ch));
    this.mat.uniforms.cells.value.set(cols, rows);
    this.rt.setSize(cols * 2, rows * 2); // 2x2 пикселя на ячейку: линейная фильтрация даёт сглаживание
  }

  /** Рисует слой 0 сцены как текст. Оверлей (слой 1) игра дорисовывает поверх сама. */
  render(scene: THREE.Scene, camera: THREE.Camera) {
    const { r } = this;
    camera.layers.set(0);
    r.setRenderTarget(this.rt);
    r.clear();
    r.render(scene, camera);
    r.setRenderTarget(null);
    r.clear();
    r.render(this.scene, this.cam);
  }

  private atlas() {
    const gw = 32, gh = 52, c = document.createElement('canvas');
    c.width = gw * RAMP.length; c.height = gh;
    const x = c.getContext('2d')!;
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold ${gh * 0.82}px ui-monospace, Menlo, Consolas, monospace`;
    [...RAMP].forEach((ch, i) => x.fillText(ch, i * gw + gw / 2, gh / 2 + 2));
    const t = new THREE.CanvasTexture(c);
    t.minFilter = t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }
}
