const SVGTEXT = function (el, option) {
	const canvas = el;
	const svgImg = new Image();
	const devicePixelRatio = window.devicePixelRatio;
	let ctx;
	let bgWrap;

	let _src = option.src || '';
	let _bgSrc = option.bgSrc || '';
	let _minScale = option.minScale || 1;
	let _maxScale = option.maxScale || 10;
	let _viewBoxW = option.viewBoxW || 1;
	let _viewBoxH = option.viewBoxH || 1;
	let _bland = option.bland || 'source-out';
	let _bgColor = option.bgColor || '#ffffff';
	let _positionX = option.positionX || 0;
	let _positionY = option.positionY || 0;
	let _alignX = option.alignX || 'center';
	let _alignY = option.alignY || 'center';
	let _originX = option.originX || 0;
	let _originY = option.originY || 0;
	let _speed = option.speed || 0.01;
	let _reverse = option.reverse || false;
	let _mode = option.mode || 'scale';
	let _startP = option.startP || 0;

	let canvasW = 0;
	let canvasH = 0;
	let widthRatio = (_viewBoxW / _viewBoxH);
	let heightRatio = (_viewBoxH / _viewBoxW);
	let prograss = 0;
	let _top = 0;
	let _left = 0;
	let frame = 0;
	let requestFrame;
	let playing = false;
	let loaded = false;

	const init = () => {
		load();
	}

	const load = () => {
		if (!loaded) {
			ctx = canvas.getContext('2d');
			svgImg.src = _src;
			svgImg.onload = () => {
				loaded = true;
				resize();
				if (_bgSrc) bgDraw();
			}
			svgImg.onerror = () => {
				console.log('error');
			}
		}
	}

	const bgDraw = () => {
		bgWrap = document.createElement('div');
		bgWrap.classList.add('svg-text-bg');
		bgWrap.style.position = 'absolute';
		bgWrap.style.width = window.innerWidth;
		bgWrap.style.height = window.innerHeight;
		bgWrap.style.backgroundImage = 'url(' + _bgSrc + ')';
		bgWrap.style.backgroundSize = 'cover';
		bgWrap.style.backgroundRepeat = 'no-repeat';
		el.parentNode.append(bgWrap);
	}

	const draw = (percent) => {
		if (loaded) drawing(percent);
	}

	const drawing = (percent) => {
		canvas.width = canvas.width;

		switch (_reverse) {
			case false:
				prograss = percent;
				if (prograss === 0) option.startEvent && option.startEvent.call();
				if (prograss === 1) option.endEvent && option.endEvent.call();
				break;
			case true:
				prograss = (1 - percent);
				if (prograss === 1) option.startEvent && option.startEvent.call();
				if (prograss === 0) option.endEvent && option.endEvent.call();
				break;
		}

		if (_mode === 'scale') getScaleDraw();
		if (_mode === 'moveX') getMoveXDraw();
		if (_mode === 'moveY') getMoveYDraw();
	}

	// img drawing
	const imgDrawing = (el, { left, top, width, height }) => {
		ctx.beginPath();
		ctx.drawImage(el, left, top, width, height);
		ctx.closePath();
	}
	// bg color drawing
	const bgColorDrawing = ({ left, top, width, height }) => {
		left = left || 0;
		top = top || 0;
		width = width || 0;
		height = height || 0;

		ctx.globalCompositeOperation = _bland;

		ctx.beginPath();
		ctx.fillStyle = _bgColor;
		ctx.fillRect(left, top, width, height);
		ctx.closePath();
	}

	const getMoveXDraw = () => {
		let minW = canvasW * _minScale * (1 - prograss);
		let maxW = (canvasW * _maxScale * prograss);

		let _height = canvasH;
		let _width = _height * widthRatio;

		_left = _startP - ((_width + _startP) * prograss);

		imgDrawing(svgImg, {
			left: _left,
			top: _top,
			width: _width,
			height: _height
		});

		bgColorDrawing({
			left: (_left - _startP),
			width: (_width + _startP),
			height: canvasH
		})
	}

	const getMoveYDraw = () => {
		let minW = canvasW * _minScale * (1 - prograss);
		let maxW = (canvasW * _maxScale * prograss);

		let _width = canvasW;
		let _height = _width * heightRatio;

		_top = _startP - ((_height + _startP) * prograss);

		imgDrawing(svgImg, {
			left: _left,
			top: _top,
			width: _width,
			height: _height
		});

		bgColorDrawing({
			top: (_top - _startP),
			width: canvasW,
			height: (_height + _startP)
		})
	}

	const getScaleDraw = () => {
		let minW = canvasW * _minScale * (1 - prograss);
		let maxW = (canvasW * _maxScale * prograss);

		let _width = minW + maxW;
		let _height = _width * heightRatio;

		switch (_alignX) {
			case 'center':
				_left = (canvasW / 2) - (_width / 2);
				break;
			case 'left':
				_left = 0;
				break;
			case 'right':
				_left = canvasW - _width;
				break;
		}
		switch (_alignY) {
			case 'center':
				_top = (canvasH / 2) - (_height / 2);
				break;
			case 'top':
				_top = 0;
				break;
			case 'bottom':
				_top = canvasH - _height;
				break;
		}

		_left = _left + _positionX - (_originX * prograss);
		_top = _top + _positionY - (_originY * prograss);

		imgDrawing(svgImg, {
			left: _left,
			top: _top,
			width: _width,
			height: _height
		});

		bgColorDrawing({
			width: canvasW,
			height: canvasH
		})
	}

	const resize = () => {
		canvasW = window.innerWidth;
		canvasH = window.innerHeight;
		canvas.width = canvasW;
		canvas.height = canvasH;

		draw(prograss);
	}

	const scroll = (p) => {
		draw(p);
	}

	// 플레이
	const play = () => {
		const playRequest = () => {
			if (frame < 1) {
				draw(frame);
				frame += _speed;
				requestFrame = window.requestAnimationFrame(playRequest);
			} else {
				stop({ reset: false });
			}
		}

		if (!playing) {
			playing = true;
			playRequest();
		}
	}

	// 일시정지
	const pause = () => {
		playing = false;
		window.cancelAnimationFrame(requestFrame);
	}

	// 정지 argument - reset : 첫번째 프레임으로 갈지 여부
	const stop = ({ reset }) => {
		frame = 0;
		pause();

		if (reset) {
			draw(0);
		} else {
			option.endEvent && option.endEvent.call();
		}
	}

	const destroy = () => {
		if (loaded) {
			loaded = false;
			canvas.width = canvas.width;
			window.cancelAnimationFrame(requestFrame);
			bgWrap.remove();
			ctx = '';
			bgWrap = '';
		}
	}

	init();

	return {
		load: load,
		draw: draw,
		resize: resize,
		scroll: scroll,
		play: play,
		pause: pause,
		stop: stop,
		destroy: destroy
	}
}