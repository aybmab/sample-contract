import React, { Component } from 'react';
import './PixelGrid.css'
import Modal from 'react-modal';

const DIMENSION = 20
const COLORS = {
  GREEN   : '#76c4Ae',
  BLUE    : '#7CE0F9',
  YELLOW  : '#CABD80',
  RED     : '#D86C70',
}

class PixelGrid extends Component {
  constructor(props){
    super(props)

    const pixels = {}
    const colors = Object.keys(COLORS)
    for (var i = 0; i < DIMENSION; i++) {
      pixels[i] = {}
      for (var j = 0; j < DIMENSION; j++) {
        const random_color = Math.floor(Math.random() * colors.length)
        pixels[i][j] = COLORS[colors[random_color]]
      };
    };

    this.state = {
      pixels,
      selected_coords_x: null,
      selected_coords_y: null,
      new_color: ''
    }
  }

  setSelectedCoords(i, j){
    this.setState({
      selected_coords_x: i,
      selected_coords_y: j
    })
  }

  closeModal() {
    this.setSelectedCoords(null, null)
  }

  updateCoordsColor() {
    const {
      pixels,
      selected_coords_x,
      selected_coords_y,
      new_color,
    } = this.state

    const updated_pixels = Object.assign({}, pixels) //shallow clone...
    pixels[selected_coords_x][selected_coords_y] = new_color
    this.setState({
      pixels: updated_pixels,
      selected_coords_x: null,
      selected_coords_y: null,
      new_color: '',
    })
  }

  render() {
    const {
      pixels,
      selected_coords_x,
      selected_coords_y,
      new_color
    } = this.state

    const rows = Object.keys(pixels)

    return (
      <div>
        <table>
          {
            rows.map(row => {
              const cols = Object.keys(pixels[row])
              return <tr key={row}>
                {
                  cols.map(col => {
                    const pixel = pixels[row][col]
                    const is_selected = (selected_coords_x === row) && (selected_coords_y === col)
                    return (
                      <td
                        key={`${row}-${col}`}
                        style={{background: is_selected ? 'black' : pixel}}
                        onClick={this.setSelectedCoords.bind(this, row, col)}
                      />
                    )
                  })
                }
              </tr>
            })
          }
        </table>

        <Modal
          isOpen={selected_coords_x && selected_coords_y}
          onRequestClose={this.closeModal.bind(this)}
          style={{
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          }}
          contentLabel="Example Modal"
        >
          <h2>Update Cell @ ({selected_coords_y}, {selected_coords_x})</h2>
          <input
            placeholder="New Color"
            value={new_color}
            onChange={e => {this.setState({new_color: e.target.value})}}
          />
          <button onClick={this.updateCoordsColor.bind(this)}> Submit </button>
        </Modal>
      </div>

    );
  }

}

export default PixelGrid;
