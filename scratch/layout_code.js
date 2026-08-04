    generateLayoutPositions(formationType, boardW, boardH) {
        const cx = boardW / 2 - this.cardW / 2;
        const cy = boardH / 2 - this.cardH / 2 - 15;
        const stepX = this.cardW * 0.72;
        const stepY = this.cardH * 0.78;
        const pos = [];

        if (formationType === 'HOURGLASS') {
            // KUM SAATI (26 Tiles)
            for (let c = -2; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy - 2 * stepY, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy - 1 * stepY, layer: 0 });
            pos.push({ x: cx, y: cy, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy + 1 * stepY, layer: 0 });
            for (let c = -2; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy + 2 * stepY, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy - 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 6, layer: 1 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy + 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx - stepX * 0.4, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.4, y: cy - 12, layer: 2 });
        } else if (formationType === 'HEART') {
            // KALP (28 Tiles)
            for (let i = 0; i < 18; i++) {
                const t = (i / 18) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                pos.push({ x: cx + x * 8.5, y: cy + y * 8.5, layer: 0 });
            }
            for (let i = 0; i < 8; i++) {
                const t = (i / 8) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                pos.push({ x: cx + x * 4.5 + 3, y: cy + y * 4.5 - 6, layer: 1 });
            }
            pos.push({ x: cx - stepX * 0.35, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.35, y: cy - 12, layer: 2 });
        } else if (formationType === 'CASTLE') {
            // KALE (34 Tiles)
            const towers = [
                { x: cx - stepX * 2, y: cy - stepY * 2 },
                { x: cx + stepX * 2, y: cy - stepY * 2 },
                { x: cx - stepX * 2, y: cy + stepY * 2 },
                { x: cx + stepX * 2, y: cy + stepY * 2 }
            ];
            for (let t of towers) {
                for (let r = 0; r < 2; r++) {
                    for (let c = 0; c < 2; c++) {
                        pos.push({ x: t.x + c * stepX, y: t.y + r * stepY, layer: 0 });
                    }
                }
            }
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy - stepY * 2, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy + stepY * 2, layer: 0 });
            pos.push({ x: cx - stepX * 2, y: cy, layer: 0 });
            pos.push({ x: cx + stepX * 2, y: cy, layer: 0 });
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    pos.push({ x: cx + c * stepX + 3, y: cy + r * stepY - 6, layer: 1 });
                }
            }
            pos.push({ x: cx + 3, y: cy - 12, layer: 2 });
        } else if (formationType === 'FLOWER') {
            // ÇİÇEK (20 Tiles)
            for (let i = 0; i < 8; i++) {
                const t = (i / 8) * Math.PI * 2;
                pos.push({ x: cx + Math.cos(t) * 125, y: cy + Math.sin(t) * 90, layer: 0 });
            }
            for (let i = 0; i < 8; i++) {
                const t = (i / 8) * Math.PI * 2 + Math.PI / 8;
                pos.push({ x: cx + Math.cos(t) * 75 + 3, y: cy + Math.sin(t) * 55 - 6, layer: 1 });
            }
            for (let r = 0; r <= 1; r++) {
                for (let c = 0; c <= 1; c++) {
                    pos.push({ x: cx + (c - 0.5) * stepX, y: cy + (r - 0.5) * stepY - 12, layer: 2 });
                }
            }
        } else if (formationType === 'SHIELD') {
            // KALKAN (28 Tiles)
            const rowPats = [[6], [6], [5], [4], [3], [2], [2]];
            for (let r = 0; r < rowPats.length; r++) {
                const count = rowPats[r][0];
                const startX = cx - ((count - 1) * stepX * 0.5);
                for (let c = 0; c < count; c++) {
                    pos.push({ x: startX + c * stepX, y: cy + (r - 3) * stepY * 0.85, layer: 0 });
                }
            }
        } else if (formationType === 'DIAMOND') {
            // ELMAS (26 Tiles)
            const rowPats = [[1], [3], [5], [7], [5], [3], [1]];
            for (let r = 0; r < rowPats.length; r++) {
                const count = rowPats[r][0];
                const startX = cx - ((count - 1) * stepX * 0.5);
                for (let c = 0; c < count; c++) {
                    pos.push({ x: startX + c * stepX, y: cy + (r - 3) * stepY * 0.85, layer: 0 });
                }
            }
        } else if (formationType === 'HELIX') {
            // SARMAL (24 Tiles)
            for (let layer = 0; layer < 2; layer++) {
                for (let i = 0; i < 12; i++) {
                    const t = (i / 12) * Math.PI * 2;
                    const r = 35 + i * 8 - layer * 10;
                    pos.push({ x: cx + Math.cos(t + layer * 0.8) * r, y: cy + Math.sin(t + layer * 0.8) * r - layer * 6, layer: layer });
                }
            }
        } else if (formationType === 'TWIN_PEAKS') {
            // ÇİFT TEPE (28 Tiles)
            const leftX = cx - stepX * 1.8;
            const rightX = cx + stepX * 1.8;
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    pos.push({ x: leftX + c * stepX, y: cy + r * stepY, layer: 0 });
                    pos.push({ x: rightX + c * stepX, y: cy + r * stepY, layer: 0 });
                }
            }
            for (let r = 0; r <= 1; r++) {
                for (let c = 0; c <= 1; c++) {
                    pos.push({ x: leftX + (c - 0.5) * stepX + 3, y: cy + (r - 0.5) * stepY - 6, layer: 1 });
                    pos.push({ x: rightX + (c - 0.5) * stepX + 3, y: cy + (r - 0.5) * stepY - 6, layer: 1 });
                }
            }
            pos.push({ x: leftX + 3, y: cy - 12, layer: 2 });
            pos.push({ x: rightX + 3, y: cy - 12, layer: 2 });
        } else if (formationType === 'ROYAL_PYRAMID') {
            // 3D PİRAMİT (36 Tiles)
            for (let r = -2; r <= 2; r++) {
                for (let c = -2; c <= 2; c++) {
                    pos.push({ x: cx + c * stepX, y: cy + r * stepY, layer: 0 });
                }
            }
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    pos.push({ x: cx + c * stepX + 3, y: cy + r * stepY - 6, layer: 1 });
                }
            }
            pos.push({ x: cx + 3, y: cy - 12, layer: 2 });
            pos.push({ x: cx + 3, y: cy - 18, layer: 2 });
        } else {
            // YILDIZ (STAR) (18 Tiles)
            const angles = [-Math.PI / 2, -Math.PI / 2 + 0.4 * Math.PI, -Math.PI / 2 + 0.8 * Math.PI, -Math.PI / 2 + 1.2 * Math.PI, -Math.PI / 2 + 1.6 * Math.PI];
            for (let a of angles) pos.push({ x: cx + Math.cos(a) * 130, y: cy + Math.sin(a) * 130, layer: 0 });
            for (let a of [angles[0]+0.2*Math.PI, angles[1]+0.2*Math.PI, angles[2]+0.2*Math.PI, angles[3]+0.2*Math.PI, angles[4]+0.2*Math.PI]) {
                pos.push({ x: cx + Math.cos(a) * 65, y: cy + Math.sin(a) * 65, layer: 0 });
            }
            pos.push({ x: cx, y: cy - stepY, layer: 1 });
            pos.push({ x: cx - stepX, y: cy, layer: 1 });
            pos.push({ x: cx, y: cy, layer: 1 });
            pos.push({ x: cx + stepX, y: cy, layer: 1 });
            pos.push({ x: cx, y: cy + stepY, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 8, layer: 2 });
            pos.push({ x: cx + 3, y: cy - 14, layer: 2 });
        }

        return pos;
    }