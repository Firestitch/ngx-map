export interface FsMapOptions extends google.maps.MapOptions {
  events?: {
    boundsChanged?: (event) => void
    centerChanged?: (event) => void
    click?: (event) => void
    contextmenu?: (event) => void
    dblclick?: (event) => void
    drag?: (event) => void
    dragend?: (event) => void
    dragstart?: (event) => void
    headingChanged?: (event) => void
    idle?: (event) => void
    maptypeidChanged?: (event) => void
    mousemove?: (event) => void
    mouseout?: (event) => void
    mouseover?: (event) => void
    projectionChanged?: (event) => void
    resize?: (event) => void
    rightclick?: (event) => void
    tilesloaded?: (event) => void
    tiltChanged?: (event) => void
    zoomChanged?: (event) => void
  }
}
