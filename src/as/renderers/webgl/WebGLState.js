/**
 * @author mrdoob / http://mrdoob.com/
 */

import { NotEqualDepth, GreaterDepth, GreaterEqualDepth, EqualDepth, LessEqualDepth, LessDepth, AlwaysDepth, NeverDepth, CullFaceFront, CullFaceBack, CullFaceNone, CustomBlending, MultiplyBlending, SubtractiveBlending, AdditiveBlending, NoBlending, NormalBlending, AddEquation, DoubleSide, BackSide } from '../../constants.js';
import { Vector4 } from '../../math/Vector4';

function WebGLState( gl, extensions, utils, capabilities ) {

	function ColorBuffer() {

		const locked = false;

		const color = new Vector4();
		const currentColorMask = null;
		const currentColorClear = new Vector4( 0, 0, 0, 0 );

		return {

			setMask: function ( colorMask ) {

				if ( currentColorMask !== colorMask && ! locked ) {

					gl.colorMask( colorMask, colorMask, colorMask, colorMask );
					currentColorMask = colorMask;

				}

			},

			setLocked: function ( lock ) {

				locked = lock;

			},

			setClear: function ( r, g, b, a, premultipliedAlpha ) {

				if ( premultipliedAlpha === true ) {

					r *= a; g *= a; b *= a;

				}

				color.set( r, g, b, a );

				if ( currentColorClear.equals( color ) === false ) {

					gl.clearColor( r, g, b, a );
					currentColorClear.copy( color );

				}

			},

			reset: function () {

				locked = false;

				currentColorMask = null;
				currentColorClear.set( - 1, 0, 0, 0 ); // set to invalid state

			}

		};

	}

	function DepthBuffer() {

		const locked = false;

		const currentDepthMask = null;
		const currentDepthFunc = null;
		const currentDepthClear = null;

		return {

			setTest: function ( depthTest ) {

				if ( depthTest ) {

					enable( gl.DEPTH_TEST );

				} else {

					disable( gl.DEPTH_TEST );

				}

			},

			setMask: function ( depthMask ) {

				if ( currentDepthMask !== depthMask && ! locked ) {

					gl.depthMask( depthMask );
					currentDepthMask = depthMask;

				}

			},

			setFunc: function ( depthFunc ) {

				if ( currentDepthFunc !== depthFunc ) {

					if ( depthFunc ) {

						switch ( depthFunc ) {

							case NeverDepth:

								gl.depthFunc( gl.NEVER );
								break;

							case AlwaysDepth:

								gl.depthFunc( gl.ALWAYS );
								break;

							case LessDepth:

								gl.depthFunc( gl.LESS );
								break;

							case LessEqualDepth:

								gl.depthFunc( gl.LEQUAL );
								break;

							case EqualDepth:

								gl.depthFunc( gl.EQUAL );
								break;

							case GreaterEqualDepth:

								gl.depthFunc( gl.GEQUAL );
								break;

							case GreaterDepth:

								gl.depthFunc( gl.GREATER );
								break;

							case NotEqualDepth:

								gl.depthFunc( gl.NOTEQUAL );
								break;

							default:

								gl.depthFunc( gl.LEQUAL );

						}

					} else {

						gl.depthFunc( gl.LEQUAL );

					}

					currentDepthFunc = depthFunc;

				}

			},

			setLocked: function ( lock ) {

				locked = lock;

			},

			setClear: function ( depth ) {

				if ( currentDepthClear !== depth ) {

					gl.clearDepth( depth );
					currentDepthClear = depth;

				}

			},

			reset: function () {

				locked = false;

				currentDepthMask = null;
				currentDepthFunc = null;
				currentDepthClear = null;

			}

		};

	}

	function StencilBuffer() {

		const locked = false;

		const currentStencilMask = null;
		const currentStencilFunc = null;
		const currentStencilRef = null;
		const currentStencilFuncMask = null;
		const currentStencilFail = null;
		const currentStencilZFail = null;
		const currentStencilZPass = null;
		const currentStencilClear = null;

		return {

			setTest: function ( stencilTest ) {

				if ( stencilTest ) {

					enable( gl.STENCIL_TEST );

				} else {

					disable( gl.STENCIL_TEST );

				}

			},

			setMask: function ( stencilMask ) {

				if ( currentStencilMask !== stencilMask && ! locked ) {

					gl.stencilMask( stencilMask );
					currentStencilMask = stencilMask;

				}

			},

			setFunc: function ( stencilFunc, stencilRef, stencilMask ) {

				if ( currentStencilFunc !== stencilFunc ||
				     currentStencilRef 	!== stencilRef 	||
				     currentStencilFuncMask !== stencilMask ) {

					gl.stencilFunc( stencilFunc, stencilRef, stencilMask );

					currentStencilFunc = stencilFunc;
					currentStencilRef = stencilRef;
					currentStencilFuncMask = stencilMask;

				}

			},

			setOp: function ( stencilFail, stencilZFail, stencilZPass ) {

				if ( currentStencilFail	 !== stencilFail 	||
				     currentStencilZFail !== stencilZFail ||
				     currentStencilZPass !== stencilZPass ) {

					gl.stencilOp( stencilFail, stencilZFail, stencilZPass );

					currentStencilFail = stencilFail;
					currentStencilZFail = stencilZFail;
					currentStencilZPass = stencilZPass;

				}

			},

			setLocked: function ( lock ) {

				locked = lock;

			},

			setClear: function ( stencil ) {

				if ( currentStencilClear !== stencil ) {

					gl.clearStencil( stencil );
					currentStencilClear = stencil;

				}

			},

			reset: function () {

				locked = false;

				currentStencilMask = null;
				currentStencilFunc = null;
				currentStencilRef = null;
				currentStencilFuncMask = null;
				currentStencilFail = null;
				currentStencilZFail = null;
				currentStencilZPass = null;
				currentStencilClear = null;

			}

		};

	}

	//

	const colorBuffer = new ColorBuffer();
	const depthBuffer = new DepthBuffer();
	const stencilBuffer = new StencilBuffer();

	const maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
	const newAttributes = new Uint8Array( maxVertexAttributes );
	const enabledAttributes = new Uint8Array( maxVertexAttributes );
	const attributeDivisors = new Uint8Array( maxVertexAttributes );

	const enabledCapabilities = {};

	const compressedTextureFormats = null;

	const currentProgram = null;

	const currentBlendingEnabled = null;
	const currentBlending = null;
	const currentBlendEquation = null;
	const currentBlendSrc = null;
	const currentBlendDst = null;
	const currentBlendEquationAlpha = null;
	const currentBlendSrcAlpha = null;
	const currentBlendDstAlpha = null;
	const currentPremultipledAlpha = false;

	const currentFlipSided = null;
	const currentCullFace = null;

	const currentLineWidth = null;

	const currentPolygonOffsetFactor = null;
	const currentPolygonOffsetUnits = null;

	const maxTextures = gl.getParameter( gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS );

	const lineWidthAvailable = false;
	const version = 0;
	const glVersion = gl.getParameter( gl.VERSION );

	if ( glVersion.indexOf( 'WebGL' ) !== - 1 ) {

		version = parseFloat( /^WebGL\ ([0-9])/.exec( glVersion )[ 1 ] );
		lineWidthAvailable = ( version >= 1.0 );

	} else if ( glVersion.indexOf( 'OpenGL ES' ) !== - 1 ) {

		version = parseFloat( /^OpenGL\ ES\ ([0-9])/.exec( glVersion )[ 1 ] );
		lineWidthAvailable = ( version >= 2.0 );

	}

	const currentTextureSlot = null;
	const currentBoundTextures = {};

	const currentScissor = new Vector4();
	const currentViewport = new Vector4();

	function createTexture( type, target, count ) {

		const data = new Uint8Array( 4 ); // 4 is required to match default unpack alignment of 4.
		const texture = gl.createTexture();

		gl.bindTexture( type, texture );
		gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	for ( let i = 0; i < count; i ++ ) {

			gl.texImage2D( target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data );

		}

		return texture;

	}

	const emptyTextures = {};
	emptyTextures[ gl.TEXTURE_2D ] = createTexture( gl.TEXTURE_2D, gl.TEXTURE_2D, 1 );
	emptyTextures[ gl.TEXTURE_CUBE_MAP ] = createTexture( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6 );

	// init

	colorBuffer.setClear( 0, 0, 0, 1 );
	depthBuffer.setClear( 1 );
	stencilBuffer.setClear( 0 );

	enable( gl.DEPTH_TEST );
	depthBuffer.setFunc( LessEqualDepth );

	setFlipSided( false );
	setCullFace( CullFaceBack );
	enable( gl.CULL_FACE );

	setBlending( NoBlending );

	//

	function initAttributes() {

	for ( let i = 0, l = newAttributes.length; i < l; i ++ ) {

			newAttributes[ i ] = 0;

		}

	}

	function enableAttribute( attribute ) {

		enableAttributeAndDivisor( attribute, 0 );

	}

	function enableAttributeAndDivisor( attribute, meshPerAttribute ) {

		newAttributes[ attribute ] = 1;

		if ( enabledAttributes[ attribute ] === 0 ) {

			gl.enableVertexAttribArray( attribute );
			enabledAttributes[ attribute ] = 1;

		}

		if ( attributeDivisors[ attribute ] !== meshPerAttribute ) {

			const extension = capabilities.isWebGL2 ? gl : extensions.get( 'ANGLE_instanced_arrays' );

			extension[ capabilities.isWebGL2 ? 'vertexAttribDivisor' : 'vertexAttribDivisorANGLE' ]( attribute, meshPerAttribute );
			attributeDivisors[ attribute ] = meshPerAttribute;

		}

	}

	function disableUnusedAttributes() {

		for ( let i = 0, l = enabledAttributes.length; i !== l; ++ i ) {

			if ( enabledAttributes[ i ] !== newAttributes[ i ] ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

	}

	function enable( id ) {

		if ( enabledCapabilities[ id ] !== true ) {

			gl.enable( id );
			enabledCapabilities[ id ] = true;

		}

	}

	function disable( id ) {

		if ( enabledCapabilities[ id ] !== false ) {

			gl.disable( id );
			enabledCapabilities[ id ] = false;

		}

	}

	function getCompressedTextureFormats() {

		if ( compressedTextureFormats === null ) {

			compressedTextureFormats = [];

			if ( extensions.get( 'WEBGL_compressed_texture_pvrtc' ) ||
			     extensions.get( 'WEBGL_compressed_texture_s3tc' ) ||
			     extensions.get( 'WEBGL_compressed_texture_etc1' ) ||
			     extensions.get( 'WEBGL_compressed_texture_astc' ) ) {

				const formats = gl.getParameter( gl.COMPRESSED_TEXTURE_FORMATS );

				for ( let i = 0; i < formats.length; i ++ ) {

					compressedTextureFormats.push( formats[ i ] );

				}

			}

		}

		return compressedTextureFormats;

	}

	function useProgram( program ) {

		if ( currentProgram !== program ) {

			gl.useProgram( program );

			currentProgram = program;

			return true;

		}

		return false;

	}

	function setBlending( blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha ) {

		if ( blending === NoBlending ) {

			if ( currentBlendingEnabled ) {

				disable( gl.BLEND );
				currentBlendingEnabled = false;

			}

			return;

		}

		if ( ! currentBlendingEnabled ) {

			enable( gl.BLEND );
			currentBlendingEnabled = true;

		}

		if ( blending !== CustomBlending ) {

			if ( blending !== currentBlending || premultipliedAlpha !== currentPremultipledAlpha ) {

				if ( currentBlendEquation !== AddEquation || currentBlendEquationAlpha !== AddEquation ) {

					gl.blendEquation( gl.FUNC_ADD );

					currentBlendEquation = AddEquation;
					currentBlendEquationAlpha = AddEquation;

				}

				if ( premultipliedAlpha ) {

					switch ( blending ) {

						case NormalBlending:
							gl.blendFuncSeparate( gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
							break;

						case AdditiveBlending:
							gl.blendFunc( gl.ONE, gl.ONE );
							break;

						case SubtractiveBlending:
							gl.blendFuncSeparate( gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA );
							break;

						case MultiplyBlending:
							gl.blendFuncSeparate( gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA );
							break;

						default:
							console.error( 'THREE.WebGLState: Invalid blending: ', blending );
							break;

					}

				} else {

					switch ( blending ) {

						case NormalBlending:
							gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
							break;

						case AdditiveBlending:
							gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
							break;

						case SubtractiveBlending:
							gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );
							break;

						case MultiplyBlending:
							gl.blendFunc( gl.ZERO, gl.SRC_COLOR );
							break;

						default:
							console.error( 'THREE.WebGLState: Invalid blending: ', blending );
							break;

					}

				}

				currentBlendSrc = null;
				currentBlendDst = null;
				currentBlendSrcAlpha = null;
				currentBlendDstAlpha = null;

				currentBlending = blending;
				currentPremultipledAlpha = premultipliedAlpha;

			}

			return;

		}

		// custom blending

		blendEquationAlpha = blendEquationAlpha || blendEquation;
		blendSrcAlpha = blendSrcAlpha || blendSrc;
		blendDstAlpha = blendDstAlpha || blendDst;

		if ( blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha ) {

			gl.blendEquationSeparate( utils.convert( blendEquation ), utils.convert( blendEquationAlpha ) );

			currentBlendEquation = blendEquation;
			currentBlendEquationAlpha = blendEquationAlpha;

		}

		if ( blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha ) {

			gl.blendFuncSeparate( utils.convert( blendSrc ), utils.convert( blendDst ), utils.convert( blendSrcAlpha ), utils.convert( blendDstAlpha ) );

			currentBlendSrc = blendSrc;
			currentBlendDst = blendDst;
			currentBlendSrcAlpha = blendSrcAlpha;
			currentBlendDstAlpha = blendDstAlpha;

		}

		currentBlending = blending;
		currentPremultipledAlpha = null;

	}

	function setMaterial( material, frontFaceCW ) {

		material.side === DoubleSide
			? disable( gl.CULL_FACE )
			: enable( gl.CULL_FACE );

		const flipSided = ( material.side === BackSide );
		if ( frontFaceCW ) flipSided = ! flipSided;

		setFlipSided( flipSided );

		( material.blending === NormalBlending && material.transparent === false )
			? setBlending( NoBlending )
			: setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha );

		depthBuffer.setFunc( material.depthFunc );
		depthBuffer.setTest( material.depthTest );
		depthBuffer.setMask( material.depthWrite );
		colorBuffer.setMask( material.colorWrite );

		setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

	}

	//

	function setFlipSided( flipSided ) {

		if ( currentFlipSided !== flipSided ) {

			if ( flipSided ) {

				gl.frontFace( gl.CW );

			} else {

				gl.frontFace( gl.CCW );

			}

			currentFlipSided = flipSided;

		}

	}

	function setCullFace( cullFace ) {

		if ( cullFace !== CullFaceNone ) {

			enable( gl.CULL_FACE );

			if ( cullFace !== currentCullFace ) {

				if ( cullFace === CullFaceBack ) {

					gl.cullFace( gl.BACK );

				} else if ( cullFace === CullFaceFront ) {

					gl.cullFace( gl.FRONT );

				} else {

					gl.cullFace( gl.FRONT_AND_BACK );

				}

			}

		} else {

			disable( gl.CULL_FACE );

		}

		currentCullFace = cullFace;

	}

	function setLineWidth( width ) {

		if ( width !== currentLineWidth ) {

			if ( lineWidthAvailable ) gl.lineWidth( width );

			currentLineWidth = width;

		}

	}

	function setPolygonOffset( polygonOffset, factor, units ) {

		if ( polygonOffset ) {

			enable( gl.POLYGON_OFFSET_FILL );

			if ( currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units ) {

				gl.polygonOffset( factor, units );

				currentPolygonOffsetFactor = factor;
				currentPolygonOffsetUnits = units;

			}

		} else {

			disable( gl.POLYGON_OFFSET_FILL );

		}

	}

	function setScissorTest( scissorTest ) {

		if ( scissorTest ) {

			enable( gl.SCISSOR_TEST );

		} else {

			disable( gl.SCISSOR_TEST );

		}

	}

	// texture

	function activeTexture( webglSlot ) {

		if ( webglSlot === undefined ) webglSlot = gl.TEXTURE0 + maxTextures - 1;

		if ( currentTextureSlot !== webglSlot ) {

			gl.activeTexture( webglSlot );
			currentTextureSlot = webglSlot;

		}

	}

	function bindTexture( webglType, webglTexture ) {

		if ( currentTextureSlot === null ) {

			activeTexture();

		}

		const boundTexture = currentBoundTextures[ currentTextureSlot ];

		if ( boundTexture === undefined ) {

			boundTexture = { type: undefined, texture: undefined };
			currentBoundTextures[ currentTextureSlot ] = boundTexture;

		}

		if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

			gl.bindTexture( webglType, webglTexture || emptyTextures[ webglType ] );

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;

		}

	}

	function compressedTexImage2D() {

		try {

			gl.compressedTexImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( 'THREE.WebGLState:', error );

		}

	}

	function texImage2D() {

		try {

			gl.texImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( 'THREE.WebGLState:', error );

		}

	}

	function texImage3D() {

		try {

			gl.texImage3D.apply( gl, arguments );

		} catch ( error ) {

			console.error( 'THREE.WebGLState:', error );

		}

	}

	//

	function scissor( scissor ) {

		if ( currentScissor.equals( scissor ) === false ) {

			gl.scissor( scissor.x, scissor.y, scissor.z, scissor.w );
			currentScissor.copy( scissor );

		}

	}

	function viewport( viewport ) {

		if ( currentViewport.equals( viewport ) === false ) {

			gl.viewport( viewport.x, viewport.y, viewport.z, viewport.w );
			currentViewport.copy( viewport );

		}

	}

	//

	function reset() {

		for ( let i = 0; i < enabledAttributes.length; i ++ ) {

			if ( enabledAttributes[ i ] === 1 ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

		enabledCapabilities = {};

		compressedTextureFormats = null;

		currentTextureSlot = null;
		currentBoundTextures = {};

		currentProgram = null;

		currentBlending = null;

		currentFlipSided = null;
		currentCullFace = null;

		colorBuffer.reset();
		depthBuffer.reset();
		stencilBuffer.reset();

	}

	return {

		buffers: {
			color: colorBuffer,
			depth: depthBuffer,
			stencil: stencilBuffer
		},

		initAttributes: initAttributes,
		enableAttribute: enableAttribute,
		enableAttributeAndDivisor: enableAttributeAndDivisor,
		disableUnusedAttributes: disableUnusedAttributes,
		enable: enable,
		disable: disable,
		getCompressedTextureFormats: getCompressedTextureFormats,

		useProgram: useProgram,

		setBlending: setBlending,
		setMaterial: setMaterial,

		setFlipSided: setFlipSided,
		setCullFace: setCullFace,

		setLineWidth: setLineWidth,
		setPolygonOffset: setPolygonOffset,

		setScissorTest: setScissorTest,

		activeTexture: activeTexture,
		bindTexture: bindTexture,
		compressedTexImage2D: compressedTexImage2D,
		texImage2D: texImage2D,
		texImage3D: texImage3D,

		scissor: scissor,
		viewport: viewport,

		reset: reset

	};

}


export { WebGLState };
