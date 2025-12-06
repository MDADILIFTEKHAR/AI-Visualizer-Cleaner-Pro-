
export const downloadChartImage = (chartId: string, fileName: string, format: 'png' | 'jpeg' = 'png') => {
  const container = document.getElementById(chartId);
  if (!container) {
    console.error(`Container with id ${chartId} not found`);
    return;
  }

  const svg = container.querySelector('svg');
  if (!svg) {
    console.error("SVG not found in chart container");
    return;
  }

  // Serialize the SVG
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Ensure namespaces are present for standalone usage
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Get exact dimensions from the SVG to ensure high resolution
  const rect = svg.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 400;

  const canvas = document.createElement('canvas');
  // Multiply by 3 for High DPI / Print quality
  const scale = 3;
  canvas.width = width * scale;
  canvas.height = height * scale;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Scale context to match the boosted resolution
  ctx.scale(scale, scale);

  const img = new Image();
  // Create a blob from the SVG source
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Fill background for JPEG (otherwise transparent pixels become black)
    if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
    }
    
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    try {
        const imgURI = canvas.toDataURL(`image/${format}`);
        
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Error generating image data URL", e);
    }
  };

  img.onerror = (e) => {
    console.error("Error loading SVG image", e);
  };

  img.src = url;
};

export const downloadChartSvg = (chartId: string, fileName: string) => {
  const container = document.getElementById(chartId);
  const svg = container?.querySelector('svg');
  if (!svg) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Ensure namespaces are present for standalone usage
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
